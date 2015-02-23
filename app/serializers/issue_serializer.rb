class IssueSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :priority
end
