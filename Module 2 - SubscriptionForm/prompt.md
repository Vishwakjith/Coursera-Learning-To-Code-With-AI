# Generate Subscription SignUp Form (HTML, CSS, JS)

This project is about creating a basic Subscription Sign-Up Form with a beautiful and mind catching design and nothing more than that.

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