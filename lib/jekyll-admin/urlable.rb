# frozen_string_literal: true

module JekyllAdmin
  module URLable
    def http_url
      return if is_a?(Jekyll::Collection) || is_a?(JekyllAdmin::DataFile)
      return if is_a?(Jekyll::Document) && !collection.write?

      @http_url ||= Addressable::URI.new(
        scheme: scheme,
        host: host,
        port: port,
        path: path_with_base(JekyllAdmin.site.config["baseurl"], url)
      ).normalize.to_s
    end

    def api_url
      @api_url ||= Addressable::URI.new(
        scheme: scheme,
        host: host,
        port: port,
        path: path_with_base("/_api", resource_path)
      ).normalize.to_s
    end

    def entries_url
      return unless is_a?(Jekyll::Collection)

      "#{api_url}/entries"
    end

    private

    def resource_path
      if is_a?(Jekyll::Document) && draft?
        "/#{relative_path.sub(%r!\A_!, "")}"
      elsif is_a?(Jekyll::Document)
        "/collections/#{relative_path.sub(%r!\A_!, "")}"
      elsif is_a?(Jekyll::Collection)
        "/collections/#{label}"
      elsif is_a?(JekyllAdmin::DataFile)
        "/data/#{relative_path}"
      elsif is_a?(Jekyll::StaticFile)
        "/static_files/#{relative_path}"
      elsif is_a?(Jekyll::Page)
        "/pages/#{relative_path}"
      end
    end

    def path_with_base(base, path)
      [base, path].join("/").squeeze("/")
    end

    def scheme
      JekyllAdmin.site.config["scheme"] || "http"
    end

    def host
      ENV["JEKYLL_EXTERNAL_HOST"] || begin
        actual_host = JekyllAdmin.site.config["host"]
        if actual_host == "0.0.0.0" || actual_host == "127.0.0.1"
          "localhost"
        else
          actual_host
        end
      end
    end

    def port
      ENV["JEKYLL_EXTERNAL_PORT"] || JekyllAdmin.site.config["port"]
    end
  end
end

