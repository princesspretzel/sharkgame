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

  # def plays

  #   plays = params['plays'].to_i
  #   current_user.num_plays += plays

  #   current_user.save!

  #   render json: current_user

  # end

end