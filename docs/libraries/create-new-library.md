# Create a new Mia service library

Can't find a specific library? You can create a new one. You will find below the suggested guidelines to develop a complete library to facilitate the creation of Mia Custom Microservices.

## Documentation
Write clear and useful documentation is as important as to write good code. This will help who using your library to interface with the Mia-Platform easily.

This section contains the guidelines to write the documentation of your Mia service library. We assume that
integrated on the various Github repositories of service libraries. For a complete example, you can see [Mia service Node.js library](https://github.com/mia-platform/custom-plugin-lib). 

### Organization of markdown files
The Readme file must be small and contain a list in which to link the various more detailed sections.
The markdown files of the macro sections have to be placed in a separate `./Docs/` folder.

### Contents
The documentation of libraries should answer to the  following questions:

1. What does it do and why should i use it?
2. How i can easy and rapidly start to use it?
3. How can I put myself into a situation where to use the library with best practices?
4. How does it interact with the Mia suite?  

A simple documentation structure to consider all questions  can be the following:

1. **Getting started**
2. **Setup the local development environment**
3. **Install**  - How to install/include the library.
4. **Main example** - A little example that immediately highlights the main use of the library. Explained step to step.
5. **Configurations** - Required configuration of environment variables and other items.
6. **Examples** - More advanced examples, with the instruction to easy launch them
7. **How to**
    * Declare routes
    * Create a custom service
    * ...
    
    Each feature is explained in detail in related ./docs/feature.md” file