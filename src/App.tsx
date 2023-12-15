import veldt from "veldt";
import "./index.css";
import soundImage from "./assets/sigmund-t-da_md1qMc-unsplash.jpg";
import { Route } from "veldt/router";
const Lol = ({
  count,
  imgRef,
}: {
  count: number;
  imgRef: { current: any };
}) => {
  let ref = veldt.ref<HTMLDivElement | null>(null);
  return (
    <div class="counter">
      <div class="counter__count" ref={ref}>
        {count}
      </div>
      <button
        onClick={() => {
          ref.current!.innerText = `${++count}`;
          imgRef.current!.style.filter = `blur(${count}px) brightness(${
            count + 1
          })`;
        }}
      >
        Count ++
      </button>
    </div>
  );
};
const App = () => {
  let count = 0;
  let ref = veldt.ref<HTMLImageElement | null>(null);
  return (
    <>
      <main>
        <h1>Veldt Project</h1>
        <p>
          Welcome to Veldt, an experimental React-like (?) framework written in
          TypeScript.
        </p>
        <Lol count={count} imgRef={ref} />
        <p>
          <img
            src={soundImage}
            class="image"
            alt="sound"
            ref={ref}
            style={{
              filter: `blur(${count}px) brightness(${count + 1})`,
              transition: "filter 0.5s ease",
            }}
          />
        </p>
        <Route path="/lol">{<div>lol</div>}</Route>
        <p>
          Edit <code>src/App.tsx</code> and save to see changes here!
        </p>
      </main>
    </>
  );
};
veldt.render(<App />, document.getElementById("root")!);
