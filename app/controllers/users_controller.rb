class UsersController < ApplicationController

  def index

  end

  def score
    
    points = params['points'].to_i
    if current_user.high_score < points
      current_user.high_score = points
    end

    current_user.num_plays += 1

    current_user.save!

    render json: current_user  

  end

  def score_json

    data = []

    User.all.each_with_index do |user, idx|
        data << {winner_num: idx, username: user.username, email: user.email, high_score: user.high_score}
      end

    render json: data 

  end

end