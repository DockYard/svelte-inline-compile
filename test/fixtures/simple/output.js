(function () {
  "use strict";

  const {
    SvelteComponentDev,
    create_component,
    destroy_component,
    dispatch_dev,
    init,
    mount_component,
    noop,
    safe_not_equal,
    transition_in,
    transition_out,
    validate_slots
  } = require("svelte/internal");

  const file = undefined;

  function create_fragment(ctx) {
    let mycomponent;
    let current;
    mycomponent = new MyComponent({
      $$inline: true
    });
    const block = {
      c: function create() {
        create_component(mycomponent.$$.fragment);
      },
      l: function claim(nodes) {
        throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
      },
      m: function mount(target, anchor) {
        mount_component(mycomponent, target, anchor);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(mycomponent.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(mycomponent.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(mycomponent, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }

  function instance($$self, $$props) {
    let {
      $$slots: slots = {},
      $$scope
    } = $$props;
    validate_slots("Component", slots, []);
    const writable_props = [];
    Object.keys($$props).forEach(key => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Component> was created with unknown prop '${key}'`);
    });
    return [];
  }

  class Component extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance, create_fragment, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Component",
        options,
        id: create_fragment.name
      });
    }

  }

  return Component;
})();