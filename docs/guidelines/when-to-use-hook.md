**Pre and Post Hooks**

Pre and Post Hooks are reusable and convenient tools that can be used with the console. But in which situation is appropriate to use them?    
 * When I want to change the behaviour of core components or the logic of frontend and backend components on which I cannot make changes.   
 * If, due to the convenience of having the functionality available through console, I want to reuse simply and quickly the same logic for more routes.    
 * When, in order to make the CMS work with filter logics, ACL has to be attached to different objects.   
 * if I want to send notifications in small and limited projects.   

Moreover, to standardize responses, conversion mapping and ACL can be used as standard architectures. 

However, they can bring disadvantages in terms of:
 * slowness of cache management
 * debugging difficulties
 * scarce vision on their usage
 * need to bring up a service to be able to use them
 
Moreover, it is not convenient to use them to define and model business flows and to manage logics with high performances.