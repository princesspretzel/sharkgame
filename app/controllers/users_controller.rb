class UsersController < ApplicationController

  def index
    # users = User.all
    # respond_to do |format|
    #   format.html
    #   format.json { render :json => users}
    # end
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

end