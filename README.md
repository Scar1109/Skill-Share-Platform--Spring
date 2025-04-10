# Skill Sharing Platform

A web app for sharing and learning various skills like coding, cooking, photography, and DIY crafts, built with **Spring Boot** and **React**.

## Technologies

- **Back-end**: Spring Boot, MongoDB, OAuth2
- **Front-end**: React, Tailwind CSS

## Setup

### 1. Back-end Setup (Spring Boot)

1. Clone the repo and navigate to the backend folder:
    ```bash
    git clone https://github.com/your-username/skill-sharing-platform.git
    cd skill-sharing-platform/backend
    ```

2. Install dependencies:
    ```bash
    mvn install
    ```

3. Run the back-end:
    ```bash
    mvn spring-boot:run
    ```

### 2. Front-end Setup (React)

1. Navigate to the front-end folder:
    ```bash
    cd skill-sharing-platform/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React app:
    ```bash
    npm start
    ```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. MongoDB Setup

- Make sure MongoDB is installed locally or use MongoDB Atlas.
- Update connection string in `src/main/resources/application.properties`.

### 4. Run the Full App

- **Back-end**: [http://localhost:8080](http://localhost:8080)
- **Front-end**: [http://localhost:3000](http://localhost:3000)

## API Endpoints

- **GET** `/posts`: Get all posts
- **POST** `/posts`: Create a new post
- **POST** `/auth/login`: OAuth2 login (Google, GitHub)
- **GET** `/users/{id}`: Get user profile

## Contributing

1. Fork the repo.
2. Create a branch for your feature.
3. Submit a pull request.

## License

MIT License
