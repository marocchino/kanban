class Api::IssuesController < ApplicationController
  def index
    render json: Issue.all
  end

  def update
    @issue = Issue.find(params[:id])
    if @issue.update(issue_params)
      head :no_content
    else
      render json: @issue.errors, status: :unprocessable_entity
    end
  end

  private
  def issue_params
    params.require(:issue).permit(:title, :status)
  end
end
