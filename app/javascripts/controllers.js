(function () {
    "use strict";

    /* Controllers */

    angular.module('myApp.controllers', ['http-auth-interceptor'])

    .controller('AppCtrl', function ($scope, Auth, authService, $location) {
        $scope.mode = "signin";
        $scope.error = {};
        $scope.user = {};

        $scope.changeMode = function (mode) {
            $scope.error = {};
            $scope.user = {};
            $scope.errors = {};
            $scope.mode = mode;
        };      

        $scope.signin = function (form) {
            Auth.login("local", {
                "email": $scope.user.email,
                "password": $scope.user.password
            }, function (err) {
                $scope.errors = {};

                if (!err) {
                    authService.loginConfirmed();
                } else {
                    angular.forEach(err.errors, function (error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.type;
                    });
                    $scope.error.other = err.message;
                }
            });
        };

        $scope.signup = function (form) {
            Auth.createUser({
                "local.email": $scope.user.email,
                "local.username": $scope.user.username,
                "local.password": $scope.user.password
            }, function (err) {
                $scope.errors = {};

                if (!err) {
                    authService.loginConfirmed();
                } else {
                    angular.forEach(err.errors, function (error, field) {
                        field = field === "local.email" ? "email" : field;
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.type;
                    });
                }
            });
        }; 

        $scope.cancel = function () {
            authService.loginCancelled();
        };
    })

    .controller('dBeaconCtrl', function ($scope, $state, $http, $timeout) {
      $scope.data = null;
      $scope.nodeLabels = {};
      $scope.linkTypes = [];
      $scope.selectedLabel = null;
      $scope.selectedRls = null;
      $scope.nodeId = null;
      $scope.nodeInfo = null;
      $scope.nodeLabel = null;
      $scope.graphInfo = "";
      $scope.editFormData = {};
      $scope.dataAddNode = {};
      $scope.addingRls = false;
      $scope.nodeChosen = [];
      $scope.deleteNode = function () {
        $http.post('/api/dbeacon/delete', {"id": $scope.nodeId}).
            success(function (data) {
              refreshView(data);
            });
      };
      $scope.editNode = function () {
        var dataToSend = {};
        for (var key in $scope.nodeInfo)
          dataToSend[key] = $scope.editFormData.hasOwnProperty(key) ? 
                            $scope.editFormData[key] : $scope.nodeInfo[key];
        $http.post('/api/dbeacon/update', {"id": $scope.nodeId, "data": dataToSend}).
          success(function (data) {
            refreshView(data);
          });
      };
      $scope.addNode = function () {
        $http.post('/api/dbeacon/addnode', {"label": $scope.selectedLabel.label, "data": $scope.dataAddNode}).
          success(function (data) {
            refreshView(data);
          });
      };
      $scope.addRls = function () {
        $http.post('/api/dbeacon/addrls', {"nodes": $scope.nodeChosen, "type": $scope.selectedRls}).
          success(function (data) {
            refreshView(data);
          });
        $scope.addingRls = false;
        $scope.selectedRls = null;
        $scope.nodeChosen = [];
      };
      $scope.chooseNodes = function () {
        if (!$scope.addingRls) {
          $scope.addingRls = true;
        } else {
          $scope.addingRls = false;
        }
        $scope.nodeChosen = [];
      };

      var height = 600;
      var svg = d3.select("#frame").append("svg")
          .attr("height", height);

      var colorTable = {}, labels = [];
      var colorTableLink = {};
      
      var node = svg.selectAll(".node"),
          linkgroup = svg.selectAll(".link"),
          link = null,
          textNode = null,
          textLink = null,
          cursor = null;

      var color = d3.scale.category20(), 
          link_color = d3.scale.ordinal()
          .domain([0, 1, 2, 3])
          .range(["#000", "#660000", "#006633", "#666600"]);

      var force = d3.layout.force()
          .nodes([{}])
          .charge(-400)
          .on("tick", tick);

      $http.get('/api/dbeacon/list').
      success(function (data, status, headers, config) {
        $scope.data = data;
        $scope.graphInfo = "Displaying " + data.nodes.length + " nodes, " + data.links.length + " relationships.";
        initLabelFields();
        updateColorRef();
        updateGraph();
        force.size([angular.element('#frame svg').width(), height]);
      });

      var refreshView = function (data) {
        $timeout(function () {
          $scope.graphInfo = data.msg;
          $scope.$apply();
        });
        return $timeout(function () {
            $state.go('.', {}, { reload: true });
        }, 1000);
      };

      var initLabelFields = function () {
        var data = $scope.data;
        data.nodes.forEach(function (node) {
          if (!$scope.nodeLabels.hasOwnProperty(node.label)) {
            $scope.nodeLabels[node.label] = [];
            $scope.nodeLabels[node.label].label = node.label;
            $scope.nodeLabels[node.label].fields = [];
            for (var key in node.data)
              $scope.nodeLabels[node.label].fields.push(key);
          }
        });
      };

      var updateColorRef = function () {
        var data = $scope.data;

        data.nodes.forEach(function (node) {
          if (!colorTable.hasOwnProperty(node.label)) {
            labels.push(node.label);
            colorTable[node.label] = color(node.group);
          }
        });

        data.links.forEach(function (link) {
          if (!colorTableLink.hasOwnProperty(link.type)) {
            $scope.linkTypes.push(link.type);
            colorTableLink[link.type] = link_color($scope.linkTypes.length - 1);
          }
        });

        labels.sort();
        $scope.linkTypes.sort();

        var colorSvgNode = d3.select("#color-table-node").append("svg");

        // for nodes
        var cNode = colorSvgNode.selectAll("circle")
        .data(labels, function (d) { return d; });
        
        var heightSvg = 0;

        cNode.enter().append("circle")
        .attr("cx", 40)
        .attr("cy", function (d, i) { return (heightSvg = 40 * i + 20); })
        .style("fill", function (d) { return colorTable[d]; })
        .attr("r", 8);

        var textNode = colorSvgNode.selectAll("text")
        .data(labels, function (d) { return d; })
        .enter().append("text");

        var labelNode = textNode
        .attr("x", 60)
        .attr("y", function (d, i) { return 40 * i + 25; })
        .text( function (d) { return d; })
        .attr("font-size", 15);

        colorSvgNode.attr("height", heightSvg + 25);
        heightSvg = 0;

        //for links
        var colorSvgLink = d3.select("#color-table-link").append("svg");
        var cLine = colorSvgLink.selectAll("line")
        .data($scope.linkTypes, function (d) { return d; });
        
        cLine.enter().append("line")
        .attr("x1", 33)
        .attr("y1", function (d, i) { return (heightSvg = 40 * i + 20); })
        .attr("x2", 47)
        .attr("y2", function (d, i) { return 40 * i + 20; })
        .style("stroke", function (d) { return colorTableLink[d]; })
        .style("stroke-width", 3);

        var textLink = colorSvgLink.selectAll("text")
        .data($scope.linkTypes, function (d) { return d; })
        .enter().append("text");

        var labelLink = textLink
        .attr("x", 60)
        .attr("y", function (d, i) { return 40 * i + 25; })
        .text( function (d) { return d; })
        .attr("font-size", 14);

        colorSvgLink.attr("height", heightSvg + 25);

        cNode.exit().remove();
        cLine.exit().remove();
      };

      var updateGraph = function () {
        var graph = $scope.data;
        force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkDistance(function (d) { return d.target.weight * 25;})
            .start();

        linkgroup = linkgroup.data(graph.links)
            .enter().append("g");
        link = linkgroup.append("line").attr("class", "link")
            .style("stroke", function (d) { return colorTableLink[d.type]; });
        textLink = linkgroup.append("text")
            .attr("class", "textLink")
            .attr("fill", "#606060")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("font-style", "italic")
            .text(function(d) { return d.type; });

        node = node.data(graph.nodes)
            .enter().append("g")
            .call(force.drag);
        node.append("circle").attr("r", 13)
            .attr("class", "node")
            .style("fill", function (d) { return color(d.group); })
            .on("click", nodeOnClick)
            .on("focusin", nodeFocusIn)
            .on("focusout", nodeFocusOut);
        textNode = node.append("text")
            .attr("class", "textNode")
            .attr("dy", 4)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .text(function(d) { return d.data.name; });
      };
      function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        textLink.attr("transform", function(d) { 
          return "translate(" + (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")"; 
        });

        node.attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; 
        });
      }

      function nodeOnClick(d) {
        $scope.nodeId = d.id;
        $scope.nodeInfo = d.data;
        $scope.nodeLabel = d.label;
        if ($scope.addingRls) {
          if ($scope.nodeChosen.length < 2) {
            $scope.nodeChosen.push(d.id);
            if ($scope.nodeChosen.length == 2) {
              $("#modalAddRls").modal("show");
            }
          }
        }
        $scope.$apply();
      }

      function nodeFocusIn() {
        d3.select(this).transition()
            .duration(400)
            .attr("r", 20);
      }
      function nodeFocusOut() {
        d3.select(this).transition()
            .duration(400)
            .attr("r", 13);
      }
    })

    .controller('dBeaconChordCtrl', function ($scope, $http) {
        $scope.data          = null;
        $scope.nodeInfo      = null;
        $scope.nodeNeighbors = null;

        $http.get('/api/dbeacon/relation').
        success(function (data, status, headers, config) {
          $scope.data = data;
          draw(data);
        });
        var indexToData = [];

        var r = 200,
            height = 700;

        var fill = d3.scale.category20c();

        var chord = d3.layout.chord()
            .padding(.04)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var arc = d3.svg.arc()
            .innerRadius(r)
            .outerRadius(r + 20);

        var svg = d3.select("#frame").append("svg")
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + angular.element('#frame svg').width() / 2 + "," + height / 2 + ")");

        function fade(opacity) {
          return function(g, i) {
            svg.selectAll("g path.chord")
            .filter(function(d) {
              return d.source.index != i && d.target.index != i;
            })
            .transition()
            .style("opacity", opacity);
          };
        }
          
        function draw(nodes) {
          var indexByName      = {},
              nameByIndex      = {},
              dataByIndex      = {},
              neighborsByIndex = {},
              matrix = [],
              index  = 0;

          // Compute a unique index for each name.
          nodes.forEach(function(d) {
            if (!(d.name in indexByName)) {
              nameByIndex[index]      = d.name;
              dataByIndex[index]      = d.data;
              neighborsByIndex[index] = d.neighbors;
              indexByName[d.name]     = index ++;
            }
          });

          // Construct a square matrix counting relationships.
          nodes.forEach(function(d) {
            var source = indexByName[d.name],
                row = matrix[source];
            if (!row) {
              row = matrix[source] = [];
              for (var i = 0; i < index; i ++) 
                row[i] = 0;
            }
            d.neighbors.forEach(function(d) { 
              row[indexByName[d]]++; 
            });
          });

          chord.matrix(matrix);

          var g = svg.selectAll("g.group")
              .data(chord.groups)
              .enter().append("g")
              .attr("class", "group");

          g.append("path")
              .style("fill", function(d) { return fill(d.index); })
              .style("stroke", function(d) { return fill(d.index); })
              .attr("d", arc)
              .on("mouseover", fade(.1))
              .on("mouseout", fade(1))
              .on("click", nodeOnClick);
              
          
          g.append("text")
              .each(function(d) { 
                d.angle     = (d.startAngle + d.endAngle) / 2;
                d.data      = dataByIndex[d.index];
                d.neighbors = neighborsByIndex[d.index];
              })
              .attr("dy", ".35em")
              .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
              .attr("transform", function(d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + (r + 26) + ")"
                    + (d.angle > Math.PI ? "rotate(180)" : "");
              })
              .text(function(d) { return nameByIndex[d.index]; });

          svg.selectAll("path.chord")
              .data(chord.chords)
              .enter().append("path")
              .attr("class", "chord")
              .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
              .style("fill", function(d) { return fill(d.source.index); })
              .attr("d", d3.svg.chord().radius(r));
        }

        function nodeOnClick(d) {
          $scope.nodeInfo      = d.data;
          $scope.nodeNeighbors = _.uniq(d.neighbors);
          $scope.$apply();
        }
    })

    .controller('BlogCtrl', function ($scope, $sce, $http) {
        $scope.articles = null;
        $scope.colors   = null;
        $scope.tagColor = [];
        $scope.toTrustedHTML = function (code) {
            return $sce.trustAsHtml(code);
        };
        $scope.parseDate = function (dateString) {
            var tokens, year, month, day;
            var monthName = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if ([null, undefined, ""].indexOf(dateString) != -1) {
                dateString = new Date();
                year = dateString.getFullYear();
                month = monthName[dateString.getMonth() + 1];
                day = dateString.getUTCDate();
                return month + " " + day + ", " + year;
            }
                
            tokens = dateString.split("-");
            year = tokens[0];
            month = monthName[parseInt(tokens[1])];
            day = tokens[2].substr(0, 2);
            return month + " " + day + ", " + year;
        };
        $scope.randomColors = function (count) {
            var hsv_to_rgb = function (h, s, v) {
                var h_i = parseInt(h * 6);
                var f = h * 6 - h_i;
                var p = v * (1 - s);
                var q = v * (1 - f * s);
                var t = v * (1 - (1 - f) * s);
                var r, g, b;
                if (h_i === 0) {
                    r = v;
                    g = t;
                    b = p;
                }
                else if (h_i === 1) {
                    r = q;
                    g = v;
                    b = p;
                }
                else if (h_i === 2) {
                    r = p;
                    g = v;
                    b = t;
                }
                else if (h_i === 3) {
                    r = p;
                    g = q;
                    b = v;
                }
                else if (h_i === 4) {
                    r = t;
                    g = p;
                    b = v;
                }
                else if (h_i === 5) {
                    r = v;
                    g = p;
                    b = q;
                }
                return "rgb(" + parseInt(r * 256) + "," + parseInt(g * 256) + "," + parseInt(b * 256) + ")";
            }
            var interval = 1 / count;
            var ratio    = 0.618033988749895;
            var startH   = (Math.random() + ratio) % 1;
            var colors   = [];

            for (var i = 0; i < count; i ++) 
            {
                var h = (startH + i * interval) % 1;
                colors.push(hsv_to_rgb(h, 0.5, 0.95));
            }

            return colors;
        };
        $scope.getArticles = function () {
            $http.get('/api/blog/articles').
                success(function (data, status, headers, config) {
                    $scope.articles = data;
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        };
        $scope.setTagColor = function () {
            $http.get('/api/tags').
                success(function (data, status, headers, config) {
                    $scope.colors = $scope.randomColors(data.length);
                    data.forEach(function (tag) {
                        $scope.tagColor[tag.name] = $scope.colors[data.indexOf(tag)];
                    });
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        };
        $scope.getArticles();
        $scope.setTagColor();
    })

    .controller("BlogEditorCtrl", function ($scope, $state, $http, $timeout) {
        $scope.article = {};
        $scope.editorMode = 'Markdown';
        $scope.publish = false;
        $scope.tagSelected = [];
        $scope.tags = {};
        var CKEditor, html = '';
        
        $scope.createEditor = function () {
            var config = {};
            CKEditor = CKEDITOR.appendTo('editor', null, html);
        };
        $scope.preview = function () {
            $('#preview').innerHTML = html = CKEditor.getData();
        };
        $scope.getTags = function () {
            $http.get('/api/tags').
                success(function (data) {
                    $scope.tags = data;
                });
        };
        $scope.addTag = function () {
            $http.post('/api/tags', {"name": $scope.newtag}).
                success(function (data, status, headers, config) {
                    $scope.getTags();
                    $scope.newtag = "";
                    console.log(data);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        };
        $scope.addArticle = function () {
            var article = $scope.article;
            article.editor = $scope.editorMode;
            article.publish = $scope.publish;
            article.tag = [];
            for (var key in $scope.tagSelected)
                article.tag.push(key);
            console.log(article.tag);
            article.content = $scope.editorMode === 'CKEditor' ? 
                              CKEditor.document.getBody().getHtml() :
                              marked($("#Markdown").val());
            $http.post('/api/blog/articles', {"data": article}).
                success(function (data, status, headers, config) {
                    console.log(data);
                    return $timeout(function () {
                        $state.go('blog', {}, { reload: true });
                    }, 1000);
                });
        };
        $scope.changeMode = function (mode) {
            $scope.editorMode = mode;
        };
        $scope.createEditor();
        $scope.getTags();
        $("#Markdown").markdown({
            autofocus: false,
            savable: false,
            height: 400,
            additionalButtons: [
            [{
                  name: "groupCustom",
                  data: [{
                    name: "cmdBeer",
                    toggle: true, // this param only take effect if you load bootstrap.js
                    title: "Beer",
                    icon: "glyphicon glyphicon-glass",
                    callback: function(e){
                      // Replace selection with some drinks
                      var chunk, cursor,
                          selected = e.getSelection(), content = e.getContent(),
                          drinks = ["Heinekken", "Budweiser",
                                    "Iron City", "Amstel Light",
                                    "Red Stripe", "Smithwicks",
                                    "Westvleteren", "Sierra Nevada",
                                    "Guinness", "Corona", "Calsberg"],
                          index = Math.floor((Math.random()*10)+1)


                      // Give random drink
                      chunk = drinks[index]

                      // transform selection and set the cursor into chunked text
                      e.replaceSelection(chunk)
                      cursor = selected.start

                      // Set the cursor
                      e.setSelection(cursor,cursor+chunk.length)
                    }
                  }]
            }]
            ]
        });
    })

    .controller('BlogListCtrl', function ($scope, $rootScope, $http) {
            
    })

    .controller('BlogArticleCtrl', function ($scope, $state, $stateParams, $http, $timeout) {
        $scope.article = $scope.articles[$stateParams.index];
        (function () {
            $http.post('/api/blog/article/update', {"aid": $scope.article.aid}).
                success(function (data, status, headers, config) {
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        }());
        $scope.deleteArticle = function () {
            $http.delete('/api/blog/article/' + $scope.article.aid).
                success(function (data, status, headers, config) {
                    return $timeout(function () {
                        $state.go('blog', {}, { reload: true });
                    }, 1000);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        };
    })

    .controller("AboutCtrl", function ($scope) {
        $scope.socialIcons = [
            {
                "name"     : "facebook",
                "href"     : "https://www.facebook.com/xinghu.lu.9",
                "label"    : "Levi"
            },
            {
                "name"     : "twitter",
                "href"     : "https://twitter.com/XinghuLu",
                "label"    : "@Levi"
            },
            {
                "name"     : "google-plus",
                "href"     : "https://plus.google.com/+XinghuLu",
                "label"    : "+Levi"
            },
            {
                "name"     : "linkedin",
                "href"     : "https://www.linkedin.com/profile/view?id=308656312",
                "label"    : "Levi"
            },
            {
                "name"     : "github-alt",
                "href"     : "https://github.com/xinghul",
                "label"    : "xinghul"
            },
            {
                "name"     : "file-pdf-o",
                "href"     : "resume",
                "label"    : "resume"
            }
        ];
        var loadIcons = function() {
            var imgPos  = $('#me').offset(),
                oTop    = imgPos.top + $("#me").height() / 2,
                oLeft   = imgPos.left + $("#me").width() / 2;
            var d      = 0,
                index  = 0;
            $(".social-buttons").find("section").each(function () {
                $(this).offset({
                    top: oTop,
                    left: oLeft - 50
                });
                // $(this).show();
                // var offset = $scope.socialIcons[index ++].offset;
                // console.log(offset);
                // $(this).delay(d).animate({
                //     top: offset.top,
                //     left: offset.left
                // }, 800);
                // d += 300;
            });
        };

        var initOffset = function() {
            var index = 0;
            $(".social-buttons").find("section").each(function () {
                $scope.socialIcons[index].offset = $(this).offset();
                index ++;
            });
            console.log($scope.socialIcons);
        };
        $(document).ready(function() {
            setTimeout(function () {
                // resetIcons();
                initOffset();
            }, 10);
            var delay = 1000;
            $('.skillbar').each(function(){
                $(this).find('.bar').delay(delay).animate({
                    width: $(this).attr('data-percent')
                }, 1000, "easeOutBounce");
                delay += 300;
            });
            // setTimeout(function () {
            //     // loadIcons();
            // }, 100);
        });
    })

    .controller('NavbarCtrl', function ($scope, $state, Auth, $location) {
        $scope.logout = function() {
            Auth.logout(function(err) {
                if (!err) {
                }
            });
        };
    });
}());