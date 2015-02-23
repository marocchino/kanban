class IssueSerializer < ActiveModel::Serializer
  attributes :title, :status, :priority
end
