var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');
 

// Private "constructors"
 
var dBeacon = module.exports = function dBeacon(_node) {
    this._node = _node;
};

Object.defineProperty(dBeacon.prototype, 'id', {
    get: function () { return this._node.id; }
});
 
// Pass-through dBeacon properties
 
function proxyProperty(prop, isFunc) {
    Object.defineProperty(dBeacon.prototype, prop, {
        get: function () {
            if (isFunc) {
                return this._node[prop];
            } else {
                return this._node.data[prop];
            }
        },
        set: function (value) {
            if (isFunc) {
                this._node[prop] = value;
            } else {
                this._node.data[prop] = value;
            }
        }
    });
}
 

dBeacon.create = function (data, callback) {
  var node = db.createNode(data);
  var beacon = new dBeacon(node);
  node.save(function (err) {
    if (err) return callback(err);
    
    node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err) {
      if (err) return callback(err);
      callback(null, beacon);
    });
  });
};
 

dBeacon.getAll = function (__callback) {
  var queryStr = [
      'MATCH (node)',
      'RETURN node, labels(node) as label'
  ].join('\n');

  db.query(queryStr, null, function (err, results_nodes) {
      if (err) return __callback(err);
      queryStr = [
        'MATCH (node)-[link]->()',
        "RETURN link"
      ].join('\n');
      db.query(queryStr, null, function (err, results_links) {
        if (err) return __callback(err);
        __callback(null, results_nodes, results_links);
      }); 
      
  });
};

dBeacon.getRelation = function (__callback) {
  var queryStr = [
      'MATCH (node)-[]->(neighbor)',
      'RETURN node, neighbor'
  ].join('\n');

  db.query(queryStr, null, function (err, results) {
      if (err) return __callback(err);
      __callback(null, results);
  });
};

dBeacon.getType = function (_type, __callback) {
  var queryStr = [
    'MATCH (data:' + _type + ')',
    'return data'
  ].join('\n');

  db.query(queryStr, null, function (err, results) {
    if (err) return __callback(err);
    var data = results.map(function (result) {
        return result['data'];
    });
    __callback(null, data);
  });
};

dBeacon.deleteById = function (_id, __callback) {
  var queryStr = [
    'MATCH (node)',
    'WHERE ID(node) = {id}',
    'DELETE node',
    'WITH node',
    'MATCH (node) -[link]- (other)',
    'DELETE link',
    'RETURN count(link) as count',
  ].join('\n');

  var params = {
    id: _id
  };

  db.query(queryStr, params, function (err, result) {
    if (err) return __callback(err);
    var msg = [
      "Node " + _id + " has been deleted. ",
      "Relationships deleted: " + result[0].count + ".",
    ].join('\n');
    __callback(null, {"msg": msg});
  });
};

dBeacon.addNode = function (_label, _data, __callback) {
  var queryStr = [
    'CREATE (node:',
    _label,
    ' {data})',
    'RETURN node'
  ].join('\n');
  var params = {
    data: _data
  };
  db.query(queryStr, params, function (err, result) {
    if (err) return __callback(err);
    var msg = "Node " + result[0]['node'].id + " (" + _label + ")" + " has been created. ";
    __callback(null, {"msg": msg});
  });
};

dBeacon.addRls = function (_type, _nodes, __callback) {
  var queryStr = [
    'MATCH node1, node2',
    'WHERE ID(node1) = {id1} and ID(node2) = {id2}',
    'CREATE (node1)-[r:',
    _type,
    ']->(node2)',
    'RETURN r',
  ].join('\n');
  var params = {
    id1: _nodes[0],
    id2: _nodes[1]
  };
  db.query(queryStr, params, function (err, result) {
    if (err) return __callback(err);
    var msg = "Relationship (" + _type + ") between node " + _nodes[0] + " and node " + _nodes[1] + " has been created.";
    __callback(null, {"msg": msg});
  });
};

