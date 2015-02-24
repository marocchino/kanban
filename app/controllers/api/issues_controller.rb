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
    rotator = Rotator.new(*params.values_at(:current, :target, :placement))
    rotator.issues(params[:status])
    rotator.save
    head :no_content
  end

  private
  def issue_params
    params.require(:issue).permit(:title, :status)
  end
end
