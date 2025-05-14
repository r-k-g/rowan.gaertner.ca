const clientId = "d91fefffde334dd0ac6887c57e787291";
const redirectUri = "https://rowan.gaertner.ca/misc/spotifyexport/";

const scope = "user-read-private playlist-read-private";
const authUrl = new URL("https://accounts.spotify.com/authorize");


// Try to get user auth codes from url
const args = new URLSearchParams(window.location.search);
const code = args.get('code');
const error = args.get('error');

if (error !== null) {
    throw new Error(`Spotify auth error: ${error}`);
}

else if (code !== null) {
    // Get access token from auth code
    exchangeCodeForToken(code);
}


function safeGetById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error(`Element with id ${id} not found.`);
    }
    return element;
}


async function redirectSpotifyAuth() {
    const generateRandomString = (length: number): string => {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const values = crypto.getRandomValues(new Uint8Array(length));
        return Array.from(values).reduce((acc: string, x: number) => acc + possible[x % possible.length], "");
    }

    const sha256 = async (plain: string): Promise<ArrayBuffer> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return await crypto.subtle.digest("SHA-256", data);
    }

    const base64encode = (input: ArrayBuffer): string => {
        const str = String.fromCharCode(...new Uint8Array(input));
        return btoa(str)
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }

    const codeVerifier = generateRandomString(64);
    window.localStorage.setItem("codeVerifier", codeVerifier);

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const params = {
        response_type: "code",
        client_id: clientId,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}


async function exchangeCodeForToken(code: string) {
    // Stored in local storage during user auth step
    const codeVerifier = window.localStorage.getItem("codeVerifier");
    if (codeVerifier === null) {
        throw new Error("No code verifier found in local storage.");
    }

    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    }

    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();

    if (response.error) {
        throw new Error(`Error getting spotify access token: ${response.error}`);
    }
    console.log(response)
    localStorage.setItem("accessToken", response.access_token);

    // Clear current url
    window.history.replaceState(null, "", window.location.pathname);

    // Enable appropriate elements
    await enableSignedIn();
}


async function enableSignedIn() {
    // remove login button, get and display user name for confirmation
    safeGetById("login").style.display = "none";

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === null) {
        throw new Error("No access token found in local storage.");
    }

    const payload = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    }
    const body = await fetch("https://api.spotify.com/v1/me", payload);
    const response = await body.json();

    console.log(response)
    sessionStorage.setItem("userId", response.id);

    const userIdDisplay = safeGetById("user-info");
    userIdDisplay.innerText = `Signed in as user: ${response.display_name}`;
    
    // Remove "disabled" from all elements that require auth
    safeGetById("load-playlists").removeAttribute("disabled");
    safeGetById("select-all").removeAttribute("disabled");
    safeGetById("select-mine").removeAttribute("disabled");
    safeGetById("export-playlists").removeAttribute("disabled");
}


async function fetchPlaylists(accessToken: string) {
    const limit = 50;
    let offset = 0;
    let total = 0;

    let playlists = [];

    do {
        const baseUrl = new URL("https://api.spotify.com/v1/me/playlists");
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });
        baseUrl.search = params.toString();

        const payload = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        }

        const body = await fetch(baseUrl.toString(), payload);
        const response = await body.json();

        playlists = playlists.concat(response.items);
        total = response.total;
        offset += limit;
    } while (playlists.length < total);

    return playlists;
}


async function loadPlaylists() {
    const accessToken: string | null = localStorage.getItem("accessToken");
    if (accessToken === null) {
        throw new Error("No access token found in local storage.");
    }

    const loadButton: HTMLElement | null = document.getElementById("load-playlists");
    if (loadButton !== null) {
        loadButton.setAttribute("disabled", "true");
        loadButton.innerText = "Loading...";

        // Clear table contents
        const tbody = safeGetById("playlists-tbody");
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }

    try {
        const playlists = await fetchPlaylists(accessToken);
        console.log(playlists);
        sessionStorage.setItem("playlists", JSON.stringify(playlists));

        // add playlists to tbody inside table with id 'playlists-table'
        const table = safeGetById("playlists-table");

        const tbody = safeGetById("playlists-tbody");
        if (tbody === undefined) {
            throw new Error("No tbody found in table with id 'playlists-table'");
        }

        for (let i = 0; i < playlists.length; i++) {
            const playlist: any = playlists[i];
            const row = document.createElement("tr");

            // checkbox for whether or not to export
            const exportCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = i.toString();
            exportCell.appendChild(checkbox);
            row.appendChild(exportCell);

            const name = document.createElement("td");
            name.innerText = playlist.name;
            row.appendChild(name);

            const owner = document.createElement("td");
            owner.innerText = playlist.owner.display_name;
            row.appendChild(owner);

            const tracks = document.createElement("td");
            tracks.innerText = playlist.tracks.total.toString();
            row.appendChild(tracks);

            tbody.appendChild(row);
        }
    }

    catch (error) {
        console.error("Error loading playlists: ", error);
    }

    finally {
        if (loadButton !== null) {
            loadButton.innerText = "Reload Playlists";
            // Re-enable button after 1 second to prevent spam
            setTimeout(() => {
                loadButton.removeAttribute("disabled");
            }, 1500);
        }
    }
}


function selectAllPlaylists(el: HTMLInputElement|null = null) {
    const table = safeGetById("playlists-table");

    const checked = el !== null ? el.checked : false;

    const checkboxes = table.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']"
    );

    // Set all checkboxes to same value as the 'select all' checkbox
    for (const checkbox of Array.from(checkboxes)) {
        checkbox.checked = checked;
    }
}

function selectMyPlaylists(el: HTMLInputElement|null = null) {
    const table = safeGetById("playlists-table");
    const checked = el !== null ? el.checked : false;

    const playlists = JSON.parse(sessionStorage.getItem("playlists") || "[]");
    if (playlists.length === 0) {
        throw new Error("No playlists found in session storage.");
    }
    const userId = sessionStorage.getItem("userId");
    if (userId === null) {
        throw new Error("No user id found in session storage.");
    }

    const checkboxes = table.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']"
    );

    for (const checkbox of Array.from(checkboxes)) {
        const ownerId = playlists[parseInt(checkbox.id)].owner.id;

        if (ownerId === userId) {
            checkbox.checked = checked;
        }
        
        // Uncheck other playlists if selecting only mine
        else if (checked) {
            checkbox.checked = false;
        }
    }
}

async function exportPlaylists() {
    // For all selected playlists, make call to spotify API to get details
    // Filter for only selected details, then export to json file and download
    const accessToken: string | null = localStorage.getItem("accessToken");
    if (accessToken === null) {
        throw new Error("No access token found in local storage.");
    }

    const playlists = JSON.parse(sessionStorage.getItem("playlists") || "[]");
    if (playlists.length === 0) {
        throw new Error("No playlists found in session storage.");
    }

    const table = safeGetById("playlists-table");
    const checkboxes = table.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']"
    );

    const selectedPlaylists = [];
    for (const checkbox of Array.from(checkboxes)) {
        if (checkbox.checked) {
            selectedPlaylists.push(playlists[parseInt(checkbox.id)]);
        }
    }

    // TODO figure out which details to get from checkboxes
    const fields = "name,owner.display_name,description,collaborative,tracks.items(track(name,artists(name),album(name,album_type)),added_by.id,added_at)"

    const playlistDetails = [];
    for (const playlist of selectedPlaylists) {
        // TODO ALSO: make separate call for playlist tracks
        const baseUrl = new URL(`https://api.spotify.com/v1/playlists/${playlist.id}`);
        const params = new URLSearchParams({
            fields: fields,
        });
        baseUrl.search = params.toString();

        const payload = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        }

        const body = await fetch(baseUrl.toString(), payload);
        const response = await body.json();

        playlistDetails.push(response);
    }

    console.log(playlistDetails);   
    const data = JSON.stringify(playlistDetails, null, 2);
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "spotify-playlists.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}