export function renderErrorPage(): string {
	return `<!doctype html>
<html lang="hy">
  <head>
    <meta charset="utf-8" />
    <title>Էջը չհաջողվեց բեռնել</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; font-weight: 700; }
      p { color: #4b5563; margin: 0 0 1.5rem; font-size: 0.875rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.6rem 1.25rem; border-radius: 9999px; font: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #2563eb; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Էջը չհաջողվեց բեռնել</h1>
      <p>Տեղի է ունեցել սխալ։ Կարող եք թարմացնել էջը կամ վերադառնալ գլխավոր էջ։</p>
      <div class="actions">
        <button class="primary" id="reload-btn">Կրկին փորձել</button>
        <a class="secondary" href="/">Գլխավոր էջ</a>
      </div>
    </div>
    <script>
      document.getElementById('reload-btn').addEventListener('click', function() {
        location.reload();
      });
    </script>
  </body>
</html>`;
}
