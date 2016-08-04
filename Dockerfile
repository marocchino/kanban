FROM ruby:2.3.1

# Install Node, postgresql-client
RUN apt-get update -y && \
    apt-get install -y nodejs npm postgresql-client --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Bundler
RUN echo 'gem: --no-rdoc --no-ri' >> /.gemrc && \
    gem install bundler
