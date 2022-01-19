const React = (function () {
  let scoped_state, scoped_deps;
  let scoped_reducer_state;

  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      return Comp;
    },

    useEffect(callback, deps_array) {
      const no_deps_exist = !deps_array;
      const deps_have_changed = scoped_deps
        ? !deps_array.every(function (dep, idx) {
            return dep === scoped_deps[idx];
          })
        : true;
      if (no_deps_exist || deps_have_changed) {
        callback();
        scoped_deps = deps_array;
      }
    },

    useReducer(reducer, initial_args, init = null) {
      if (init !== null) {
        scoped_reducer_state = init();
      } else {
        scoped_reducer_state = scoped_reducer_state || initial_args;
      }

      function dispatch(args) {
        scoped_reducer_state = reducer(scoped_reducer_state, args);
      }

      return [scoped_reducer_state, dispatch];
    },

    useState(initial_state) {
      scoped_state = scoped_state || initial_state;
      function setState(val) {
        if (typeof val == "function") {
          scoped_state = val(scoped_state);
        } else {
          scoped_state = val;
        }
      }

      return [scoped_state, setState];
    },
  };
})();

const MyComp = function () {
  const { useState, useEffect, useReducer } = React;
  const [state, setState] = useState(0);
  const [value, dispatch] = useReducer(Reducer, "");

  useEffect(
    function () {
      console.log("render ", state);
    },
    [state]
  );

  return {
    test_dispatch: () => {
      dispatch({ type: "Yes" });
    },
    test_dispatch2: () => {
      dispatch({ type: "No" });
    },
    click: () => setState((prev) => prev + 1),
    render: () => console.log("reducer state: ", value),
    no_side_effect: () => setState(state),
  };
};

let App;

App = React.render(MyComp);
App.click();
App = React.render(MyComp);
App.test_dispatch();
App = React.render(MyComp);
App.test_dispatch2();
App = React.render(MyComp);

// App = React.render(MyComp);
// export default React;

function Reducer(state, action) {
  switch (action.type) {
    case "Yes":
      state = "YES";
      return state;
    case "No":
      state = "NO";
      return state;

    default:
      return state;
  }
}
