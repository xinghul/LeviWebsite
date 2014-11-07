match (n)-[r]-() delete n, r;

match (n) delete n;

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Anywhere', id: 'ANY', label: 'LocationType'});
		merge (pt:PositionType {name: 'Anywhere', id: 'ANY', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Interactive ', id: 'ANY', major: 8, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: 'Placeholder for future work', localization: '', keyword: 'unknown', id: '4469736E-6579-426B-6E31-3333374D4B50:8:0', segue: '', dbeacon: '', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'ANY'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Anywhere', id: 'ANY', label: 'Area'});
		merge (at:AreaType {name: 'Anywhere', id: 'ANY', label: 'AreaType'});
		merge (rt:RegionType {name: 'Anywhere', id: 'ANY', label: 'RegionType'});
		merge (lt:LocationType {name: 'Anywhere', id: 'ANY', label: 'LocationType'});
		merge (pt:PositionType {name: 'Anywhere', id: 'ANY', label: 'PositionType'});
		merge (r:Region {uuid: '5B65BD14-81FE-4E06-A988-98E8929213B3', name: 'Brian\'s iBeacon', id: 'ANY', label: 'Region'});
		merge (l:Location {name: 'Brian\'s Computer (usually)', id: 'ANY', label: 'Location'});
		merge (p:Position {name: 'Anywhere', interaction: 'Indicates when Brian\'s beacon is immediate you', localization: '0', keyword: 'notification', id: '5B65BD14-81FE-4E06-A988-98E8929213B3::', segue: 'brianpc', dbeacon: '', proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'ANY'}), (r:Region {id: 'ANY'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'ANY'}), (p:Position {id: '5B65BD14-81FE-4E06-A988-98E8929213B3::'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'ANY'}), (a:Area {id: 'ANY'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'ANY'}), (r:Region {id: 'ANY'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ANY'}), (p:Position {id: '5B65BD14-81FE-4E06-A988-98E8929213B3::'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Animal Kingdom', id: 'AK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Theme Park', id: 'TP', label: 'RegionType'});
		merge (lt:LocationType {name: 'Restaurant', id: 'FOOD', label: 'LocationType'});
		merge (pt:PositionType {name: 'Anywhere', id: 'ANY', label: 'PositionType'});
		merge (r:Region {uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', name: 'Boma', id: 'AK', label: 'Region'});
		merge (l:Location {name: 'Could be anywhere', id: 'BOMA', major: 1, label: 'Location'});
		merge (p:Position {name: 'Anywhere', interaction: 'Displays Boma placard', localization: '', keyword: 'notification', id: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0:1:2', segue: 'UnusedSegue', dbeacon: '', minor: 2, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'AK'}), (r:Region {id: 'AK'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'AK'}), (l:Location {id: 'BOMA'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'BOMA'}), (p:Position {id: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0:1:2'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'AK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'TP'}), (r:Region {id: 'AK'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'FOOD'}), (l:Location {id: 'BOMA'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ANY'}), (p:Position {id: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0:1:2'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Anywhere', id: 'ANY', label: 'Area'});
		merge (at:AreaType {name: 'Anywhere', id: 'ANY', label: 'AreaType'});
		merge (rt:RegionType {name: 'Anywhere', id: 'ANY', label: 'RegionType'});
		merge (lt:LocationType {name: 'Anywhere', id: 'ANY', label: 'LocationType'});
		merge (pt:PositionType {name: 'Anywhere', id: 'ANY', label: 'PositionType'});
		merge (r:Region {uuid: '3AA037D9-1D55-4F89-B273-92D71874A2F2', name: 'Global Reset', id: 'ANY', label: 'Region'});
		merge (l:Location {name: 'Usually a handheld', id: 'ANY', label: 'Location'});
		merge (p:Position {name: 'Anywhere', interaction: '', localization: 'Whenever this one is detected, reset all notification flags on all beacons', keyword: 'reset', id: '3AA037D9-1D55-4F89-B273-92D71874A2F2::', segue: '', dbeacon: '', proximity: 'far', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'ANY'}), (r:Region {id: 'ANY'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'ANY'}), (p:Position {id: '3AA037D9-1D55-4F89-B273-92D71874A2F2::'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'ANY'}), (a:Area {id: 'ANY'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'ANY'}), (r:Region {id: 'ANY'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ANY'}), (p:Position {id: '3AA037D9-1D55-4F89-B273-92D71874A2F2::'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Entrance', id: 'ENTER', label: 'LocationType'});
		merge (pt:PositionType {name: 'Entrance', id: 'ENTER', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Castle to New Fantasyland Gates ', id: 'NFE', major: 2, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: 'Alert/Pooh FP in 15min', localization: 'Welcome ## to New Fantasyland!', keyword: 'notification', id: '4469736E-6579-426B-6E31-3333374D4B50:2:0', segue: 'entryNotificationOnly', dbeacon: '', minor: 0, proximity: 'near', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'NFE'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'NFE'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:2:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ENTER'}), (l:Location {id: 'NFE'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ENTER'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:2:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Entrance', id: 'ENTER', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'The Many Adventures of Winnie the Pooh', id: 'POOH', major: 1, label: 'Location'});
		merge (p:Position {name: 'Entrance at Tree', interaction: 'Pooh FP Now', localization: '', keyword: 'passbook', id: '4469736E-6579-426B-6E31-3333374D4B50:1:12', segue: '', dbeacon: '', minor: 12, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'POOH'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'POOH'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:12'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'POOH'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ENTER'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:12'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Queue', id: 'Q', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'The Many Adventures of Winnie the Pooh', id: 'POOH', major: 1, label: 'Location'});
		merge (p:Position {name: 'Queue', interaction: 'Slide to Play', localization: 'While you\'re waiting, Pooh\'s friend Lumpy can help you find the Heffalump hiding in your imagination!', keyword: 'notification', id: '4469736E-6579-426B-6E31-3333374D4B50:1:14', segue: 'queueentertainmentP', dbeacon: '', minor: 14, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'POOH'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'POOH'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:14'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'POOH'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'Q'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:14'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Captioning', id: 'CAP', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'The Many Adventures of Winnie the Pooh', id: 'POOH', major: 1, label: 'Location'});
		merge (p:Position {name: 'Unload Console', interaction: 'Captioning', localization: 'Handheld Captioning available', keyword: 'caption', id: '4469736E-6579-426B-6E31-3333374D4B50:1:0', segue: 'captioning', dbeacon: '0701370A', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'POOH'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'POOH'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'POOH'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'CAP'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Exit', id: 'EXIT', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'The Many Adventures of Winnie the Pooh', id: 'POOH', major: 1, label: 'Location'});
		merge (p:Position {name: 'Exit Shop Shelf', interaction: 'Pooh Rate It/PVH offer (conditional)', localization: 'Rate it!  How did you like the Many Adventures of Winnie the Pooh?', keyword: 'offer', id: '4469736E-6579-426B-6E31-3333374D4B50:1:13', segue: 'rating', dbeacon: '', minor: 13, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'POOH'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'POOH'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:13'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'POOH'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'EXIT'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:1:13'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Restaurant', id: 'DINE', label: 'LocationType'});
		merge (pt:PositionType {name: 'Entrance', id: 'ENTER', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Village Haus ', id: 'VH', major: 3, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: 'Filtered menu', localization: '', keyword: 'notification', id: '4469736E-6579-426B-6E31-3333374D4B50:3:0', segue: 'pinocchio', dbeacon: '', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'VH'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'VH'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:3:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'DINE'}), (l:Location {id: 'VH'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ENTER'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:3:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Restaurant', id: 'DINE', label: 'LocationType'});
		merge (pt:PositionType {name: 'POS Station', id: 'POS', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Village Haus ', id: 'VH', major: 3, label: 'Location'});
		merge (p:Position {name: 'Counter', interaction: 'Display passbook coupon if exists', localization: '', keyword: 'passbook', id: '4469736E-6579-426B-6E31-3333374D4B50:3:1', segue: 'pinocchiooffer', dbeacon: '', minor: 1, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'VH'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'VH'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:3:1'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'DINE'}), (l:Location {id: 'VH'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'POS'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:3:1'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Entrance', id: 'ENTER', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Runaway Mine Train', id: 'SDMT', major: 4, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: 'Fastpass Now', localization: '', keyword: 'passbook', id: '4469736E-6579-426B-6E31-3333374D4B50:4:0', segue: '', dbeacon: '', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'SDMT'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'SDMT'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:4:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'SDMT'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ENTER'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:4:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Queue', id: 'Q', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Runaway Mine Train', id: 'SDMT', major: 4, label: 'Location'});
		merge (p:Position {name: 'Queue', interaction: 'Queue Entertainment', localization: 'Let\'s play a game with the Seven Dwarfs', keyword: 'notification', id: '4469736E-6579-426B-6E31-3333374D4B50:4:1', segue: 'queueentertainmentMT', dbeacon: '', minor: 1, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'SDMT'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'SDMT'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:4:1'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'SDMT'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'Q'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:4:1'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Attraction', id: 'ATTR', label: 'LocationType'});
		merge (pt:PositionType {name: 'Exit', id: 'EXIT', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Runaway Mine Train', id: 'SDMT', major: 4, label: 'Location'});
		merge (p:Position {name: 'Exit', interaction: 'Send photo or msg to Facebook', localization: 'Would you like to send your Memory Maker photo from the Seven Dwarfs Mine Train to your Facebook account?', keyword: 'social', id: '4469736E-6579-426B-6E31-3333374D4B50:4:2', segue: 'facebook', dbeacon: '', minor: 2, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'SDMT'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'SDMT'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:4:2'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ATTR'}), (l:Location {id: 'SDMT'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'EXIT'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:4:2'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Restaurant', id: 'FOOD', label: 'LocationType'});
		merge (pt:PositionType {name: 'Table', id: 'TABLE', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Be Our Guest', id: 'BOG', major: 5, label: 'Location'});
		merge (p:Position {name: 'Table 1', interaction: 'view photos', localization: 'Check out your MemoryMaker photos from today!', keyword: 'notification', id: '4469736E-6579-426B-6E31-3333374D4B50:5:1', segue: 'pictures', dbeacon: '', minor: 1, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'BOG'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'BOG'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:5:1'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'FOOD'}), (l:Location {id: 'BOG'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'TABLE'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:5:1'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Restaurant', id: 'DINE', label: 'LocationType'});
		merge (pt:PositionType {name: 'Exit', id: 'EXIT', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Be Our Guest', id: 'BOG', major: 5, label: 'Location'});
		merge (p:Position {name: 'Exit', interaction: 'Receive Bonjour Special Discount', localization: 'A special offer for Bonjour! Village Gifts', keyword: 'offer', id: '4469736E-6579-426B-6E31-3333374D4B50:5:2', segue: 'bon', dbeacon: '', minor: 2, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'BOG'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'BOG'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:5:2'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'DINE'}), (l:Location {id: 'BOG'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'EXIT'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:5:2'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Restaurant', id: 'DINE', label: 'LocationType'});
		merge (pt:PositionType {name: 'Meet & Greet', id: 'MEET', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Gaston ', id: 'GASTON', major: 6, label: 'Location'});
		merge (p:Position {name: 'Meet & Greet Location', interaction: 'Notification Gaston is present', localization: 'A visit with Gaston is not to be missed! You can find him immediate Gaston\'s Tavern right now.', keyword: 'notification', id: '4469736E-6579-426B-6E31-3333374D4B50:6:0', segue: 'character', dbeacon: '', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'GASTON'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'GASTON'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:6:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'DINE'}), (l:Location {id: 'GASTON'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'MEET'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:6:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Store', id: 'STORE', label: 'LocationType'});
		merge (pt:PositionType {name: 'Entrance', id: 'ENTER', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Bonjour! Village Gifts ', id: 'BONJOUR', major: 7, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: 'Display passbook coupon if exists', localization: '', keyword: 'passbook', id: '4469736E-6579-426B-6E31-3333374D4B50:7:0', segue: '', dbeacon: '', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'BONJOUR'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'BONJOUR'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:7:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'STORE'}), (l:Location {id: 'BONJOUR'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ENTER'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:7:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Anywhere', id: 'ANY', label: 'LocationType'});
		merge (pt:PositionType {name: 'Anywhere', id: 'ANY', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Office', id: 'ANY', major: 8, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: '', localization: '', keyword: 'unknown', id: '4469736E-6579-426B-6E31-3333374D4B50:8:0', segue: '', dbeacon: '', minor: 0, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'ANY'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:0'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:0'})
		merge (pt)<-[:is_a]-(p);

		# Create nodes
		merge (a:Area {name:'Magic Kingdom', id: 'MK', label: 'Area'});
		merge (at:AreaType {name: 'Theme Park', id: 'TP', label: 'AreaType'});
		merge (rt:RegionType {name: 'Land', id: 'LAND', label: 'RegionType'});
		merge (lt:LocationType {name: 'Anywhere', id: 'ANY', label: 'LocationType'});
		merge (pt:PositionType {name: 'Anywhere', id: 'ANY', label: 'PositionType'});
		merge (r:Region {uuid: '4469736E-6579-426B-6E31-3333374D4B50', name: 'New Fantasyland', id: 'NF', label: 'Region'});
		merge (l:Location {name: 'Office', id: 'ANY', major: 8, label: 'Location'});
		merge (p:Position {name: 'Entrance', interaction: '', localization: '', keyword: 'unknown', id: '4469736E-6579-426B-6E31-3333374D4B50:8:1', segue: '', dbeacon: '', minor: 1, proximity: 'immediate', label: 'Position'});
		# Create relationships
		match (a:Area {id: 'MK'}), (r:Region {id: 'NF'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: 'NF'}), (l:Location {id: 'ANY'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:1'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: 'TP'}), (a:Area {id: 'MK'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: 'LAND'}), (r:Region {id: 'NF'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: 'ANY'}), (l:Location {id: 'ANY'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:1'})
		merge (pt)<-[:is_a]-(p);

