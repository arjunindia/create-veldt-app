# Veldt

Veldt is a tiny JSX based Library, inspired by other JSX based libraries.

## Getting Started

To get started, you can clone this repo and run `npm install` and `npm run dev` to start the dev server.

Or quickly scaffold a new project by running
    
```bash
npx degit https://github.com/arjunindia/create-veldt-app my-app
cd my-app
npm install
npm run dev
```

## Usage

Veldt is a JSX based library, so you can use it like this:

```jsx
import veldt from "veldt";
const App = () => {
  return (
    <>
      <main>
          Welcome to Veldt, an experimental React-like (?) framework written in
          TypeScript.
      </main>
    </>
  );
};
veldt.render(<App />, document.getElementById("root")!);
```

## Building

To build Veldt, run `npm run build`. This will create a `build` folder with the compiled code.

## Contributing

The entire source code for the library itself is in `veldt/index.ts`.
I'm more than welcome to accept contributions to this project. Veldt is just a learning project for me right now. If you have any suggestions, please open an issue or a pull request.