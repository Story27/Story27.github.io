# Next.js Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Technologies Used

- **Next.js**: A React framework for building web applications.
- **PostgreSQL on Neon**: A cloud-native PostgreSQL database service.
- **Prisma ORM**: An open-source database toolkit for TypeScript and Node.js.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Resend**: An email sending service.
- **shadcn/ui**: A UI component library.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **AWS**: Amazon Web Services for cloud computing.
- **Auth.js**: Authentication for Next.js applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Project Setup

### Prerequisites

- Node.js
- Docker (optional, for containerized development)
- PostgreSQL database (Neon)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/your-project.git
   cd your-project
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of your project and add the necessary environment variables. Refer to `.env.example` for the required variables.

4. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

### Building and Running in Docker

1. Build the Docker image:

   ```bash
   docker build -t your-project .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 your-project
   ```

### Deployment

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details on deploying your application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

```
