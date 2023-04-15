module Jekyll
  class CardTagBlock < Liquid::Block
    # def initialize(tag_name, markup, tokens)
    #   super
    # end


    def render(context)
      text = super      
      # <<~HTML 
      #   <div class="card">
      #     <div class="info-col">
      #       <div class="date-range">
      #         <span class="date end"> January 2021 </span>
      #         <span class="vl"></span>
      #         <span class="date start"> December 2021 </span>
      #       </div>
      #       <div class="links">
      #         <a href="https://github.com/r-k-g/simon-game" target="_blank" rel="noopener noreferrer"> GitHub </a>
      #       </div>
      #     </div>

      #     <div class="description-col">
      #       <details>
      #         <summary> Pattern Memory Game </summary>
      #           <img src="/assets/images/simon_sc.png" loading="lazy">
      #           <p>A simon-like light pattern memory game. Originally an assignment for a computer science class, the task was to recreate the game simon using pyFLTK. With some free time on my hands, I added circular button hit detection, a score saving system, and window resizing.</p>
      #       </details>
      #     </div>
      #   </div>
      # HTML
      Jekyll::Converters::Markdown.new("*pasta*").third_party_processors().methods
      
      
    end

  end
end

Liquid::Template.register_tag('render_card', Jekyll::CardTagBlock)