module Jekyll
  class CardTagBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @title = nil
      @start_date = nil
      @end_date = nil
      @links = Hash.new
      @description = nil
    end
    
    def render(context)
      content = super
      parse_content(content)

      links_html = ""
      @links.each do |name, url|
        links_html += "<a href='#{url}' target='_blank' rel='noopener noreferrer'>#{name}</a>"
      end

      <<~HTML
        <div class="card">
          <div class="info-col">
            <div class="date-range">
              <span class="date end"> #{@end_date} </span>
              <span class="vl"></span>
              <span class="date start"> #{@start_date} </span>
            </div>
            <div class="links">
              #{links_html}
            </div>
          </div>
        
          <div class="description-col">
            <details>
              <summary> #{@title} </summary>
                #{Kramdown::Document.new(@description).to_html}
            </details>
          </div>
        </div>
      HTML
    end

    def parse_content(content)
      # Separate title and date range
      lines = content.strip.split("\n")
      @title = lines.shift.strip
      date_range = lines.shift.strip.split("-")
      @start_date = date_range[0].strip
      @end_date = date_range[1].strip
    
      # Look for links after the date range
      while lines.first&.strip&.match?(/\A\[.*\]\(.*\)\z/)
        link_line = lines.shift.strip
        link_parts = link_line.match(/\A\[(.*)\]\((.*)\)\z/)
        @links[link_parts[1]] = link_parts[2]
      end
    
      # The rest is the description
      @description = lines.join("\n").strip
    end    
  end
end

Liquid::Template.register_tag('render_card', Jekyll::CardTagBlock)
