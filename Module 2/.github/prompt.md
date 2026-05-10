# Generate Subscription SignUp Form (HTML, CSS, JS)

This project is about creating a basic Subscription Sign-Up Form with a beautiful and mind catching design and nothing more than that.

1. General:
    - If the task is done already, please re-verify and if suggestions are needed please update it and proceed with next task.
    - The code should be understandable for new comers or the people who started learning coding recently as-well.
    - If there is going to be even a slight hard task/code add comments accordingly so the new coders will be able to understand it.
    - In this project we will use only HTML, CSS, JS.
    - The project structure must be in such a way that we have separate folder for HTML, CSS, JS, assets. The "index.html" file must be at the root folder.

2. HTML:
    - Do not create unwanted tags.
    - There should be no inline styles or scripts.
    - Make sure the required meta tags for responsiveness and website crawlers are present.
    - Make sure there is a favicon.
    - Title of the project should "LearnAI Sign-Up"
    - No iframe tags and other bad standards should not be followed.

3. CSS:
    - Always aim on responsiveness on different devices.
    - Implement hover styling wherever possible.
    - Add box-shadow wherever possible.
    - Should keep in mind the rendering order and style properly in such a way it doesn't affect the performance.

4. JS:
    - Use event listener for the any interaction.
    - Try to follow time and memory management.
    - No innerHtml or innerText should be used.
    - No bad standards must be followed.
    - No Code Smells or Security Concerning code must be used.

## Generate a Basic Form UI

- The form should be center and inside of a popped up box.
- Let's add any Image with a bit of interesting and funny way.
- Below that we will add any Title, Subtitle describing the context of the form we are trying to build.
- There should be input fields such as Name, Email and Subscribe button to submit the form.
- Validations must be done when the customer enters values in the input fields, such as,
    1. Name:
        - Required.
        - Not more than 64 characters.
        - No special characters or numbers.
        - Should allow all language characters.
        - Other validations that are needed apart from above.
    2. Email:
        - Required.
        - Not more than 64 characters.
        - There must be "@" in the email id.
        - There must be domain in the email id.
        - Other validations that are needed apart from above.
- For the respective validations, a error message must be shown on the UI so that the customer will be able to rectify it.
- The button must be enabled only when there is no error in customer entered values.

## Translation

- Let's store all the translations in a separate folder called "i18n" and under that we will have all language JSONs.
- Create a small dropdown in the top right of the form for the language selection.
- The value in the dropdown must be  based on all the file names present in the "i18n" folder. For now create a en.json, es.json and no.json file.
- Implement code logic to update the application language dynamically when the specific language is clicked from the dropdown.

## Light/Dark Theme

-