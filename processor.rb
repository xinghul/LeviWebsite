require './neoconnect'
require 'csv'
require 'erb'


class String
	def is_number?
		true if Float(self) rescue false
	end
end

class DBeacon

	def initialize
		@@nc = NeoConnect.new

		@@template = ERB.new <<-TEMPLATE
		# Create nodes
		merge (a:Area {name:'<%=h['area']%>', id: '<%=h['areaid']%>', label: 'Area'});
		merge (at:AreaType {name: '<%=h['areatype']%>', id: '<%=h['areatypeid']%>', label: 'AreaType'});
		merge (rt:RegionType {name: '<%=h['regiontype']%>', id: '<%=h['regiontypeid']%>', label: 'RegionType'});
		merge (lt:LocationType {name: '<%=h['locationtype']%>', id: '<%=h['locationtypeid']%>', label: 'LocationType'});
		merge (pt:PositionType {name: '<%=h['positiontype']%>', id: '<%=h['positiontypeid']%>', label: 'PositionType'});
		merge (r:Region {uuid: '<%=h['uuid']%>', name: '<%=h['region']%>', id: '<%=h['regionid']%>', label: 'Region'});
		merge (l:Location {name: '<%=h['location']%>', id: '<%=h['locationid']%>'<%=(h['major'] ? ', major: ' + h['major'] : '')%>, label: 'Location'});
		merge (p:Position {name: '<%=h['position']%>', interaction: '<%=h['interaction']%>', localization: '<%=h['localization']%>', keyword: '<%=h['keyword']%>', id: '<%=h['positionid']%>', segue: '<%=h['segue']%>', dbeacon: '<%=h['dbeaconid']%>'<%=(h['minor'] ? ', minor: ' + h['minor'] : '')%>, proximity: '<%=h['proximity']%>', label: 'Position'});
		# Create relationships
		match (a:Area {id: '<%=h['areaid']%>'}), (r:Region {id: '<%=h['regionid']%>'})
		merge (a)-[:contains]->(r);
		match (r:Region {id: '<%=h['regionid']%>'}), (l:Location {id: '<%=h['locationid']%>'})
		merge (r)-[:contains]->(l);
		match (l:Location {id: '<%=h['locationid']%>'}), (p:Position {id: '<%=h['positionid']%>'})
		merge (l)-[:contains]->(p);
		match (at:AreaType {id: '<%=h['areatypeid']%>'}), (a:Area {id: '<%=h['areaid']%>'})
		merge (at)<-[:is_a]-(a);
		match (rt:RegionType {id: '<%=h['regiontypeid']%>'}), (r:Region {id: '<%=h['regionid']%>'})
		merge (rt)<-[:is_a]-(r);
		match (lt:LocationType {id: '<%=h['locationtypeid']%>'}), (l:Location {id: '<%=h['locationid']%>'})
		merge (lt)<-[:is_a]-(l);
		match (pt:PositionType {id: '<%=h['positiontypeid']%>'}), (p:Position {id: '<%=h['positionid']%>'})
		merge (pt)<-[:is_a]-(p);

		TEMPLATE
		#puts @@template

		# This deletes all the nodes, so only uncomment it if you are raking the graph
		query = "match (n)-[r]-() delete n, r;\n\n";
		puts query
		#@@nc.connection.execute_query(query)
		query = "match (n) delete n;\n\n";
		puts query
		#@@nc.connection.execute_query(query)

		filenames = []
		filenames << "iBeacon UUID Mappings.csv"

		filenames.each do|f|
			max = 0
			count = 0
			fieldnames = {}
			values = {}
			CSV.foreach(f) do |s|
				begin
					if count == 0 then
						# Process headers
						fieldnames =  s
					else
						h = fieldnames.zip(s).to_h
						# Uncomment to stop on particular entries
						#next unless /Gaston/.match(h['location'])
						s.each{|item|
							if not item.to_s.empty? # Skip the nil objects
								item.gsub!(/'/){ %q(\') } # Escape the single quotes
							end
						}
						puts @@template.result(binding)    
					end
					# Only covering max lines
					count = count + 1
					break if max > 0 and count > max
				rescue
					puts "Problem with this string:\n#{s}"
					puts $!, $@
					exit
				end
			end
		end

	end

	def self.nc
		@@nc
	end

	def self.connection
		self.nc.connection
	end
	
end

db = DBeacon.new()
