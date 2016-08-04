# frozen_string_literal: true
Rails.application.routes.draw do
  root 'application#index'
  namespace :api do
    resources :issues
  end
end
