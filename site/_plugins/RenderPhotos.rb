module Jekyll
  class PhotosTag < Liquid::Tag
    def initialize(tag_name, pathname, tokens)
      @pathname = pathname
    end
    
    def render(context)
      output = "<div class=\"gallery\">"

      files = Dir.entries(Dir.pwd + "/assets/images/photos")
      photos = files.sort.reject { |i| i == "." or i == ".." or i == "large"}

      photos.each do |photo|
        output += <<~HTML
                    <img src="/assets/images/photos/#{photo}" alt="#{photo}"
                      loading="lazy" onclick="openImage(this.src)">
                  HTML
      end

      output += "</div>"
      output
    end

    def parse_content(content)
    end

  end
end

Liquid::Template.register_tag('render_photos', Jekyll::PhotosTag)
