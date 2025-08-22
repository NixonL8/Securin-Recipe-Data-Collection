Securin-Recipe-Data-Collection


At first We need to insert the Data to Database Mongodb which is coded in server.js. Once You connected to the db it will get store
<img width="1392" height="361" alt="image" src="https://github.com/user-attachments/assets/b0aff33c-3520-47d1-b4bf-58890ad162d7" />
The data given in json format store in db as object 
Before that we have to flexible all schema so that we can parse and do the execution so that i created fix.js to make all schema in acceptable manner.
<img width="1537" height="898" alt="image" src="https://github.com/user-attachments/assets/5cd1ab8e-54c6-4cdc-a7b6-2546a13f9e21" />
Next we need to create a backend to implement filter,pagination,clear..etc
<img width="1891" height="952" alt="image" src="https://github.com/user-attachments/assets/8fa4f98c-d7b2-4837-9ba1-d5fd9af48566" />

Filteration:
<img width="1918" height="822" alt="image" src="https://github.com/user-attachments/assets/013795c8-b55f-4e86-9d94-bac291391dc5" />
Pagination:
<img width="1898" height="965" alt="image" src="https://github.com/user-attachments/assets/2476c9a6-74c5-4a41-a863-b56a3641ba67" />

Steps To run:
>npm install mongoose

>npm install express

>node fix.js

>node server.js ----> To run in the localhost
