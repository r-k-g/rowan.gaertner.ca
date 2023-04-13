module Jekyll
  class RenderTimeTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
      @tokens = tokens
    end
    
    def render(context)
      "#{@text} #{Time.now} TOK:#{@tokens}"
    end
  end
end

Liquid::Template.register_tag('render_time', Jekyll::RenderTimeTag)