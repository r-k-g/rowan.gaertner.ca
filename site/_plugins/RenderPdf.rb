module Jekyll
    class PdfTag < Liquid::Tag
        def initialize(tag_name, pathname, tokens)
        @pathname = pathname
        end
        
        def render(context)
        output = <<~HTML
                    <object type="application/pdf" data="#{@pathname}" width="100%" height="900px">
                        PDF viewer not working. Click 
                        <a href="#{@pathname}">here</a> to download.
                    </object>
                    HTML
        output
        end
    
        def parse_content(content)
        end
    
    end
    end

    Liquid::Template.register_tag('render_pdf', Jekyll::PdfTag)
