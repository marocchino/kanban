# frozen_string_literal: true
module Api
  class IssuesController < ApplicationController
    def index
      render json: Issue.all
    end

    def update
      # TODO: should rotate in here
      @issue = Issue.find(params[:id])
      @issue.attributes = issue_params
      if @issue.changed.include?('status')
        @issue.set_next_priority
        @issue.save
      end

      if params[:target_priority]
        rotator = Rotator.new(@issue.priority,
                              params[:target_priority],
                              params[:placement])
        rotator.issues(@issue.status)
        rotator.save
      end
      head :no_content
    end

    private

    def issue_params
      params.require(:issue).permit(:title, :status)
    end
  end
end
