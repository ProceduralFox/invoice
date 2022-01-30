# App premise and architecture

This App is one in a collection of projects that I've built to design provided by https://www.frontendmentor.io/. I've done several of these because I believe that a design-to-code workflow is common in many companies and I've wanted to demonstrate my ability to work to an assignment. I was provided with figma files, and a desired feature description and the implementation was all on me.

The App uses React Router to conditional render one of two components corresponding to the list of all invoices and a detailed view of a selected invoice alongside a sidebar and a hidden component which handles creating or editing invoices. Light/Dark mode is handled by a Redux global state value which is then used to conditionally render classes. Redux is also used to handle the presence of the create/edit invoice component which simply returns a null if the respective reducer state value is not toggled on and returns the given component if it is. Given that the UI and even the behavior between creating an invoice and editing an invoice is very similar  I've decided to have them both be included in a single component and have their relative differences be active based on the current url.

Data security is handled primarily on the back-end using firebase security rules that I've defined and so the front-end primarily just runs an alert informing the user of why their CRUD action has failed. Github OAuth is used for the authentication. I am generally a big proponent of OAuth over traditional authorization with an account and password on every and each website because I believe it greatly improves the user experience. 

Form validation is handled by a custom function that has different validation standards depending on whether the user is saving the invoice as a draft or as a final version. The create/edit component is the largest component off the app jsx wise and I believe that in the future I would try to write the data writing and validation functions in a separate file with a bit cleaner flow so that their presence wouldn't hinder the readability of the main UI rendering component file.

# Most valuable lesson


The most notable lesson from this project was I'd say the importance of approaching the design file as an ideal result if possible, but not as absolute dogma. Several times during the making of this app I noticed design decisions which did not scale well when there was for example a different amount of entries in a given array compared to what was present on the figma file and so I've reworked them to fit within the overall design system but be largely input agnostic.(within the given schema of course)
