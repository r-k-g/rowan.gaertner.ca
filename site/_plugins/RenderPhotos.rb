module Jekyll
  class PhotosTag < Liquid::Tag
    def initialize(tag_name, pathname, tokens)
      @pathname = pathname
    end
    
    def render(context)
      output = ""
      Dir.foreach(Dir.pwd + "/assets/images/photos") do |photo|
        output += "![thingy](/assets/images/photos/#{photo})\n"
      end

      output
      # <<~HTML
      # HTML
    end

    def parse_content(content)
    end

  end
end

Liquid::Template.register_tag('render_photos', Jekyll::PhotosTag)
