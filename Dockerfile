FROM ruby:2.2.0

# Install Node, postgresql-client
RUN apt-get update -y && \
    apt-get install -y nodejs npm postgresql-client --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Bundler
RUN echo 'gem: --no-rdoc --no-ri' >> /.gemrc && \
    gem install bundler
