class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Devise will authenticate user before every page
  before_filter :authenticate_user!

  attr_accessor :stylesheets

  # Splits stylesheets between files 
  before_filter do |c|
    c.stylesheets ||= []
    controller_name = c.class.name.sub('Controller','').downcase.gsub(':', '')
    puts "--------------------------------------"
    puts controller_name
    puts "--------------------------------------"
    c.stylesheets << controller_name if File.exists?("#{Rails.root}/app/assets/stylesheets/#{controller_name}.css")
    
  end


end
