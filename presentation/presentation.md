# AI Powered Search

THIS IS NOT A WORD FOR WORD SCRIPT. 

slides : https://docs.google.com/presentation/d/1R0HWr7r3Oqo7ukEx7GMZHpMBHeCEOTG804gD0O3ftcU/edit?usp=sharing

Rankings
- **Relevance (20%):** How well does the solution address the identified public sector challenge?
- **Innovation (20%):** Is the solution novel and creative in its approach?
- **Technical Implementation (20%):** Quality of code, design, and technical documentation.
- **Scalability (20%):** Potential for implementation across multiple departments/organizations.
- **User Experience (20%):** How intuitive and user-friendly is the solution?

---
**Intro: Relevance** 

Names of team members

Shout out to Stable Kernel!

--- 

**Relevance** 

The panalist from the city government expressed a common challenge of communicating informatinon to the people of Atlanta. 

- John Saxton of the DOT: People don't know of the 10+ transit services.
- Paulina Guzman of International Affairs: migrant families have a hard time finding information about public services
- Sasha smith Office of Technology and Innovation: Upcoming world cup will bring people from accross the world to Atlanta. 

The common thread here is Information availabilty and accessibility. 

---

**Show Current State of the website: User Experience**

- point out that both these websites have a prominant search box
- You can translate the page but the results are not translated.

Persona: World Cup fan trying to find information about transit. 

- ask audiance if anyone speaks portuguese? "imagine that a Brazilian fan is in atlanta for the World Cup and they need info about airport transit"
**"trânsito do aeroporto para o estádio"**

Persona: Person seeking asylum looking for help. In Spanish!
"servicios de asilo"


--- 

**Show AI Search: User Experience**

"Let's try those searches again"

- point out that the results are in portugese or spanish
- we don't have to go find a translate button
- the results are directly from the dot gov site

---

**How does this work: Innovation/Techical**

TODO: create data diagram
TODO: create documentation

- Show diagram - We used an OpenAI to translate the search results to the langague of the search query. 
The data used is from the current .gov site but can be expanded to out data sources. 

- talk through tech documentation 

---

**Scalability**

Can be scaled horizontally to the 311 site, street kiosks, and stand alone site.

- 311 has a chat option. this search is different and focused on providing the most accurate results. 
- Kiosks data sources would be geographical specific. Potholes, transit hours, transit providers (10+), police non emergency info.
- A site similar to google's landing page. An efficient search engine trained on Atlanta's public sector data and local government services. 



TODO create figma mockups of the kiosks