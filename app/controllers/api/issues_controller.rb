# frozen_string_literal: true
module Api
  class IssuesController < ApplicationController
    def index
      render json: Issue.order(:priority)
    end

    def update
      @issue = Issue.find(params[:id])
      Rotator.rotate(@issue, update_params)
      head :no_content
    end

    private

    def update_params
      params.permit(:status, :target_priority, :placement)
    end
  end
end
