# Toast

## Usage

1. Add `<Toasts />` component somewhere in your layout component (e.g. App.svelte or \_layout.svelte, etc).

   ```react
   <script lang="ts">
    import { Toasts } from '$lib/components/toast';
   </script>

   <Toasts position="bottom-right" />

   <div>
    <Header />
    <div>
     <SideMenu />
     <main>
      <slot />
     </main>
    </div>
    <Footer />
   </div>
   ```

2. Use `addToast()` method to emit notifications in svelte component or in `ts` file.

   ```react
   <script lang="ts">
    import { addToast, ToastLevel } from '$lib/components/toast';
    import { Button } from 'flowbite-svelte';
   </script>

   <svelte:head>
    <title>Dashboard/test</title>
    <meta name="description" content="Dashboard test" />
   </svelte:head>

   <h2>Settings</h2>
   <Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: false, timeout: 6000, type: ToastLevel.Error })}">Error</Button>
   <Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: true, timeout: 6000, type: ToastLevel.Warning })}">Warning</Button>
   <Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: false, timeout: 6000, type: ToastLevel.Success })}">Success</Button>
   <Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: true, timeout: 6000, type: ToastLevel.Info })}">Info</Button>
   ```
