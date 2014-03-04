# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(email: 'brittany@brittany.com', username: 'brittany', password: 'brittany', password_confirmation: 'brittany', high_score: '640')
User.create(email: 'omar@omar.com', username: 'teechromdel', password: 'omaromar', password_confirmation: 'omaromar', high_score: '120')
User.create(email: 'test@example.com', username: 'badatgames', password: 'vroomvroom', password_confirmation: 'vroomvroom', high_score: '35')
User.create(email: 'julie@mejulie.com', username: 'mejulieme', password: 'mejulieme', password_confirmation: 'mejulieme', high_score: '350')
User.create(email: 'meglett@plunklett.com', username: 'meggyplunky', password: 'meghann1', password_confirmation: 'meghann1', high_score: '420')