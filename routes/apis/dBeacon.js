(function () {
    "use strict";
    var request = require('request'),
        fs      = require('fs');

    var dBeacon = require('../model_neo4j/dBeacon');

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    exports.query = function (req, resp, __next) {
        var query = req.body.query;
        if (isEmpty(query))
            query = "MATCH (n:dBeacon) RETURN n"
        request.post(
            "http://localhost:7474/db/data/cypher", 
            {
                body: JSON.stringify({"query": query, "params":{}})
            }, 
            function (err, res, body) {
                resp.send(body);
            }
        );
    }

    exports.getAll = function (req, res, __next) {
        dBeacon.getAll(function (err, results_nodes, results_links) {
            if (err) return __next(err);
            var id = [], labels = [];
            var data = {}, nodes = [], links = [];
            results_nodes.forEach(function (node) {
                id.push(node['node'].id);
                if (labels.indexOf(node['label'][0]) == -1)
                    labels.push(node['label'][0]);
                nodes.push({
                    "id": node['node'].id, 
                    "label": node['label'][0],
                    "group": labels.indexOf(node['label'][0]),
                    "data": node['node']._data.data
                });
                
            });
            results_links.forEach(function (link) {
                links.push({
                    "id": link['link'].id, 
                    "source": id.indexOf(extractId(link['link']._data.start)), 
                    "target": id.indexOf(extractId(link['link']._data.end)),
                    "type": link['link']._data.type
                });
            });
            data.nodes = nodes;
            data.links = links;
            res.send(data);
        });
    };

    exports.getRelation = function (req, res, __next) {
        dBeacon.getRelation(function (err, results) {
            var nodes = {}
            ,   data = [];
            results.forEach(function (node) {
                var id = node['node'].id;
                if (!nodes.hasOwnProperty(id))
                    nodes[id] = {'data': node['node'].data, 'neighbors': []};
                nodes[id].neighbors.push(node['neighbor'].data.name);
            });
            for (var key in nodes) 
            {
                var node = nodes[key]
                ,   tmp = {};
                tmp.name = node.data.name;
                tmp.neighbors = node.neighbors;
                data.push(tmp);
            }
            res.send(data);
        });
    };

    exports.getAttr = function(req, res, __next) {
        var _attr = req.params._attr;
        if (!dBeacon.prototype.hasOwnProperty(_attr)) {
            var err = new Error('Property "' + _attr + '" Not Found');
            err.status = 452;
            return __callback(err);
        }
        dBeacon.getAll(function (err, beacons) {
            if (err) return __callback(err);
            var data = beacons.map(function (beacon) {
                return {"id": beacon.id, "data": beacon[_attr]};
            });
            res.send(data);
        });
    };

    exports.getType = function (req, res, __next) {
        dBeacon.getType(req.params._type, function (err, results) {
            if (err) return __next(err);
            var data = results.map(function (result) {
                return {"id": result.id, "data": result._data.data};
            });
            res.send(data);
        });
    };

    exports.deleteById = function (req, res, __next) {
        dBeacon.deleteById(req.body.id, function (err, msg){
            if (err) return __next(err);
            res.writeHead(200, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify(msg));
        });
    };

    exports.updateById = function (req, resp, __next) {
        request.put(
            "http://localhost:7474/db/data/node/" + req.body.id + "/properties", 
            {
                body: JSON.stringify(req.body.data)
            }, 
            function (err, res, body) {
                if (err) return __next(err);
                resp.writeHead(200, { 'Content-Type' : 'application/json' });
                resp.end(JSON.stringify({"msg": "Node " + req.body.id + " properties updated."}));
            }
        );
    };

    exports.addNode = function (req, res, __next) {
        dBeacon.addNode(req.body.label, req.body.data, function (err, msg){
            if (err) return __next(err);
            res.writeHead(200, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify(msg));
        });
    };

    exports.addRls = function (req, res, __next) {
        dBeacon.addRls(req.body.type, req.body.nodes, function (err, msg){
            if (err) return __next(err);
            res.writeHead(200, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify(msg));
        });
    };

    var extractId = function (str) {
        return parseInt(str.substring(str.lastIndexOf('/') + 1));
    };
}());
    


