---
title: RepoStory
thumbnail: /assets/images/thumbnails/repostory.png
date: 2025-09-12
date_range: September 2025
---

RepoStory takes any public GitHub repository and separates its history into "milestones," creating a readable project timeline that lets you put yourself in the developer's shoes and understand their design process.

![RepoStory](/assets/images/resized/repostory.png)

This was a two-person team project at Hack the North 2025, where it won a sponsor prize from Cerebras. I worked on the AI agent, the FastAPI backend, and the React/Next.js frontend.

The agent is built with openai-agents and powered by Cerebras for fast inference; it's engineered to lazily collect data about commits in a milestone in steps of increasing complexity, then use that data to choose which files to actually examine. For example, it's obviously more likely to query the diff for `project.py` than `node_modules`. We stream the agent's progress to the frontend, so users can watch tool calls and see the timeline generate in real time.

On the Git side, performance was a priority. It's not feasible to just send _everything_ to the agent, so we only fetch tree objects on initialization, never blobs, and minimize expensive diff operations. To select meaningful milestone boundaries, we use a heuristic that measures "work done" between commits, then used Git's bisect utility to binary search for the commit that crosses a threshold.

![RepoStory Timeline](/assets/images/resized/repostory2.png)

Find the project on [GitHub](https://github.com/zjteachen/HTN2025).
