require 'Date'
require 'rubygems'
require 'neography'
require 'neography-batch'
require "solid_assert"
require 'byebug'

class NeoConnect 
	
	SolidAssert.enable_assertions #https://github.com/jorgemanrubia/solid_assert
	@@connection = nil

	def connection
		Neography.configure do |config|
		  config.protocol       = "http://"
		  config.server         = "127.0.0.1"
		  config.port           = 7474
		  config.directory      = ""  # prefix this path with '/' 
		  config.cypher_path    = "/cypher"
		  config.gremlin_path   = "/ext/GremlinPlugin/graphdb/execute_script"
		  config.log_file       = "neography.log"
		  config.log_enabled    = false
		  config.max_threads    = 20
		  config.authentication = 'basic'  # 'basic' or 'digest'
		  config.username       = ''
		  config.password       = ''
		  config.parser         = MultiJsonParser
		end

		@@connection = Neography::Rest.new if not @@connection
		assert @@connection != nil, "@@connection should not be nil"
		@@connection
	end

	def list_indexes
		puts(JSON.pretty_generate(@connection.list_node_indexes))
	end

	def neoQuery(node)
		if node then
			if node['data'].empty?
				return nil
			end
		end
		return node
	end

	def processDate(date)
		puts "Processing date #{date}..."
		prv = date - 1
		nxt = date + 1
		addcommands = []
		commands = []
		index = -1

		commands << [:create_unique_node, :year_index,  :year,  date.year,  {:label => :year,  :name => date.year.to_s, :year => date.year, :value => date.year, :display => "Year: #{date.year}"}]
		yearnode = (index += 1)
		monthname = Date::MONTHNAMES[date.month]
		monthabbr = Date::ABBR_MONTHNAMES[date.month]
		commands << [:create_unique_node, :month_index, :month, date.month, {:label => :month, :name => monthname, :abbr => monthabbr, :month => date.month, :value => date.month, :display => "Month: #{monthname}"}]
		monthnode = (index += 1)
		commands << [:create_unique_node, :day_index,   :day,   date.day,   {:label => :day,   :name => date.day.to_s, :day => date.day, :value => date.day, :display => "Day: #{date.day}"}]
		daynode = (index += 1)
		

		# Now create the hyperedge that relates the three
		commands << [:create_unique_node, :date_index, :date, prv, {:label => :date, :name => prv.strftime("%Y-%m-%d"), :dow => Date::DAYNAMES[prv.wday], :abbr => Date::ABBR_DAYNAMES[prv.wday], :date => prv.strftime("%Y-%m-%d"), :year => prv.year, :month => prv.month, :day => prv.day, :display => "#{Date::DAYNAMES[prv.wday]}: #{prv}"}]
		previousday = (index += 1)
		commands << [:create_unique_node, :date_index, :date, date, {:label => :date, :name => date.strftime("%Y-%m-%d"), :dow => Date::DAYNAMES[date.wday], :abbr => Date::ABBR_DAYNAMES[date.wday], :date => date.strftime("%Y-%m-%d"), :year => date.year, :month => date.month, :day => date.day, :display => "#{Date::DAYNAMES[date.wday]}: #{date}"}]
		datenode= (index += 1)
		commands << [:create_unique_node, :date_index, :date, nxt, {:label => :date, :name => nxt.strftime("%Y-%m-%d"), :dow => Date::DAYNAMES[nxt.wday], :abbr => Date::ABBR_DAYNAMES[nxt.wday], :date => nxt.strftime("%Y-%m-%d"), :year => nxt.year, :month => nxt.month, :day => nxt.day, :display => "#{Date::DAYNAMES[nxt.wday]}: #{nxt}"}]
		nextday = (index += 1)

		# Collect the ID's created and then reference those for creating the relationships
		ids = @connection.batch(*commands)
		commands = []
		# Create the relationships
		#@connection.batch [:create_unique_relationship, index_name, key, value, "friends", node1, node2]

		commands << [:create_unique_relationship, :year_month_index, :year_month, "#{date.year.to_s}-#{date.month.to_s}", date.month.to_s, ids[yearnode]["body"]["self"], ids[monthnode]["body"]["self"]] 
		commands << [:create_unique_relationship, :month_day_index, :month_day, "#{date.month.to_s}-#{date.day.to_s}", date.day.to_s, ids[monthnode]["body"]["self"], ids[daynode]["body"]["self"]] 
		commands << [:create_unique_relationship, :year_date_index, :year_date, date.strftime("%Y-%m-%d"), :YEAR, ids[yearnode]["body"]["self"], ids[datenode]["body"]["self"]] 
		commands << [:create_unique_relationship, :month_date_index, :month_date, date.strftime("%Y-%m-%d"), :MONTH, ids[monthnode]["body"]["self"], ids[datenode]["body"]["self"]] 
		commands << [:create_unique_relationship, :day_date_index, :day_date, date.strftime("%Y-%m-%d"), :DAY, ids[daynode]["body"]["self"], ids[datenode]["body"]["self"]] 
		commands << [:create_unique_relationship, :next_day_index, :date, date.strftime("%Y-%m-%d"), :NEXT, ids[previousday]["body"]["self"], ids[datenode]["body"]["self"]]                   
		commands << [:create_unique_relationship, :next_day_index, :date, nxt.strftime("%Y-%m-%d"), :NEXT, ids[datenode]["body"]["self"], ids[nextday]["body"]["self"]]                      

		execute_neo_batch(commands, false)
	end

	def execute_neo_batch(commands, printing)
		if printing then
			commands.each{|command|
				puts command.join(", ")
			}
		end
		result = JSON.pretty_generate(@connection.batch *commands)
		puts result if printing
	end

	def nodedata(testnode, field)
		result = nil
		begin
			result = testnode["body"]["data"][field]
			result = testnode["body"][0]["data"][field] unless result
		rescue Exception => e
			byebug
			puts "The node you passed doesn't contain a field for #{field}:\n#{JSON.pretty_generate(testnode)}"
		end
		result	
	end

	def selfnode(testnode)
		result = nil
		begin
			if testnode.class == Hash then
				if testnode["body"] then
					result = testnode["body"]["self"]
					result = testnode["body"][0]["self"] unless testnode
				end
			end
		rescue Exception => e
			byedebug
			puts "selfnode #{e}"
			puts "The node you passed doesn't have a 'self' property:\n#{JSON.pretty_generate(testnode)}"
		end
		result	
	end

	def update_labels
		@connection.execute_query('match (n) where (n.label="year") set n:Calendar')
		@connection.execute_query('match (n) where (n.label="month") set n:Calendar')
		@connection.execute_query('match (n) where (n.label="day") set n:Calendar')
		@connection.execute_query('match (n) where (n.label="date") set n:Calendar')

		@connection.execute_query('match (n) where (n.label="year") set n:Year')
		@connection.execute_query('match (n) where (n.label="month") set n:Month')
		@connection.execute_query('match (n) where (n.label="day") set n:Day')
		@connection.execute_query('match (n) where (n.label="date") set n:Date')

		@connection.execute_query('match (n) where (n.label="block") set n:Block')
		@connection.execute_query('match (n) where (n.label="facility") set n:Facility')
		@connection.execute_query('match (n) where (n.label="room_asset") set n:RoomAsset')
		@connection.execute_query('match (n) where (n.label="roomtype") set n:RoomType')
		@connection.execute_query('match (n) where (n.label="yieldtype") set n:YieldType')
	end

end

@nc = NeoConnect.new if not @nc
@neo = @nc.connection if not @neo
