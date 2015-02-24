class Api::IssuesController < ApplicationController
  def index
    render json: Issue.all
  end

  def move
    # TODO: should rotate in here
    @issue = Issue.find(params[:id])
    @issue.attributes = issue_params
    @issue.set_next_priority
    if @issue.save
      head :no_content
    else
      render json: @issue.errors, status: :unprocessable_entity
    end
  end

  def rotate
    # TODO: get placement properly
    issues = Issue.status(params[:status]).where(priority: priorities).all
    result = issues.zip(rotated_priorities).all? do |issue, priority|
      issue.update_attribute(:priority, priority)
    end
    if result
      head :no_content
    else
      render json: issues.find{|i| !i.valid? }.errors,
             status: :unprocessable_entity
    end
  end

  private
  def issue_params
    params.require(:issue).permit(:title, :status)
  end

  def priorities
    p rotator
    rotator.array
  end

  def rotated_priorities
    rotator.rotate
  end

  def rotator
    @rotator ||= Rotator.new(*params.values_at(:current, :target, :placement))
  end
end
