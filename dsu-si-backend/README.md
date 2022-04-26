<h1>DSU Chat App</h1>
<h2>Imagenes links: </h2>
- https://hub.docker.com/r/gmrp/dsu-si-frontend
- https://hub.docker.com/r/gmrp/dsu-si-backend
- Deje un docker compose
<section id="summary">
  <div>
    <p>
      A simple chat app that implements sockets and makes an effort to be easy on the eyes. Backend enpoints will be exposed to facilitate some additional functionality.
    </p>
  </div>
</section>

<br />

<h2>Feature List</h2>

<section id="v0.0.1">
  <div>
    <p>
      <h3>v0.0.1</h3>
      <ul>
        <li>Non authenticated GET request to root path is equivalent to a login.</li>
        <li>Default username is assigned (User #), based on an in memory counter of logins.</li>
        <li>Closing the tab or window, or refreshing, is equivalent to a logout.</li>
        <li>Messages are broadcasted to all logged in users.</li>
        <li>Own messages are differentiated in screen (each author's username is attached to the message).</li>
        <li>Users may change their name, affecting future messages only.</li>
        <li>Messages are saved to memory only.</li>
        <li>Backend, unauthenticated, enpoints expose getting all messages and, deleting all messages.</li>
        <li>Uses EJS templating and Bootstrap 5 for layout.</li>
        <li>Swagger UI</li>
        <li>Unit testing with Jest.</li>
      </ul>
    </p>
  </div>
</section>
