var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var clientId = "d91fefffde334dd0ac6887c57e787291";
var redirectUri = "https://rowan.gaertner.ca/misc/spotifyexport/";
var scope = "user-read-private playlist-read-private";
var authUrl = new URL("https://accounts.spotify.com/authorize");
// Try to get user auth codes from url
var args = new URLSearchParams(window.location.search);
var code = args.get('code');
var error = args.get('error');
if (error !== null) {
    throw new Error("Spotify auth error: ".concat(error));
}
else if (code !== null) {
    // Get access token from auth code
    exchangeCodeForToken(code);
}
function safeGetById(id) {
    var element = document.getElementById(id);
    if (element === null) {
        throw new Error("Element with id ".concat(id, " not found."));
    }
    return element;
}
function redirectSpotifyAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var generateRandomString, sha256, base64encode, codeVerifier, hashed, codeChallenge, params;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    generateRandomString = function (length) {
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        var values = crypto.getRandomValues(new Uint8Array(length));
                        return Array.from(values).reduce(function (acc, x) { return acc + possible[x % possible.length]; }, "");
                    };
                    sha256 = function (plain) { return __awaiter(_this, void 0, void 0, function () {
                        var encoder, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    encoder = new TextEncoder();
                                    data = encoder.encode(plain);
                                    return [4 /*yield*/, crypto.subtle.digest("SHA-256", data)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    base64encode = function (input) {
                        var str = String.fromCharCode.apply(String, __spreadArray([], __read(new Uint8Array(input)), false));
                        return btoa(str)
                            .replace(/=/g, "")
                            .replace(/\+/g, "-")
                            .replace(/\//g, "_");
                    };
                    codeVerifier = generateRandomString(64);
                    window.localStorage.setItem("codeVerifier", codeVerifier);
                    return [4 /*yield*/, sha256(codeVerifier)];
                case 1:
                    hashed = _a.sent();
                    codeChallenge = base64encode(hashed);
                    params = {
                        response_type: "code",
                        client_id: clientId,
                        scope: scope,
                        code_challenge_method: "S256",
                        code_challenge: codeChallenge,
                        redirect_uri: redirectUri,
                    };
                    authUrl.search = new URLSearchParams(params).toString();
                    window.location.href = authUrl.toString();
                    return [2 /*return*/];
            }
        });
    });
}
function exchangeCodeForToken(code) {
    return __awaiter(this, void 0, void 0, function () {
        var codeVerifier, payload, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    codeVerifier = window.localStorage.getItem("codeVerifier");
                    if (codeVerifier === null) {
                        throw new Error("No code verifier found in local storage.");
                    }
                    payload = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            client_id: clientId,
                            grant_type: "authorization_code",
                            code: code,
                            redirect_uri: redirectUri,
                            code_verifier: codeVerifier,
                        }),
                    };
                    return [4 /*yield*/, fetch("https://accounts.spotify.com/api/token", payload)];
                case 1:
                    body = _a.sent();
                    return [4 /*yield*/, body.json()];
                case 2:
                    response = _a.sent();
                    if (response.error) {
                        throw new Error("Error getting spotify access token: ".concat(response.error));
                    }
                    console.log(response);
                    localStorage.setItem("accessToken", response.access_token);
                    // Clear current url
                    window.history.replaceState(null, "", window.location.pathname);
                    // Enable appropriate elements
                    return [4 /*yield*/, enableSignedIn()];
                case 3:
                    // Enable appropriate elements
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function enableSignedIn() {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, payload, body, response, userIdDisplay;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // remove login button, get and display user name for confirmation
                    safeGetById("login").style.display = "none";
                    accessToken = localStorage.getItem("accessToken");
                    if (accessToken === null) {
                        throw new Error("No access token found in local storage.");
                    }
                    payload = {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer ".concat(accessToken),
                        }
                    };
                    return [4 /*yield*/, fetch("https://api.spotify.com/v1/me", payload)];
                case 1:
                    body = _a.sent();
                    return [4 /*yield*/, body.json()];
                case 2:
                    response = _a.sent();
                    console.log(response);
                    sessionStorage.setItem("userId", response.id);
                    userIdDisplay = safeGetById("user-info");
                    userIdDisplay.innerText = "Signed in as user: ".concat(response.display_name);
                    // Remove "disabled" from all elements that require auth
                    safeGetById("load-playlists").removeAttribute("disabled");
                    safeGetById("select-all").removeAttribute("disabled");
                    safeGetById("select-mine").removeAttribute("disabled");
                    safeGetById("export-playlists").removeAttribute("disabled");
                    return [2 /*return*/];
            }
        });
    });
}
function fetchPlaylists(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, offset, total, playlists, baseUrl, params, payload, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    limit = 50;
                    offset = 0;
                    total = 0;
                    playlists = [];
                    _a.label = 1;
                case 1:
                    baseUrl = new URL("https://api.spotify.com/v1/me/playlists");
                    params = new URLSearchParams({
                        limit: limit.toString(),
                        offset: offset.toString(),
                    });
                    baseUrl.search = params.toString();
                    payload = {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer ".concat(accessToken),
                        }
                    };
                    return [4 /*yield*/, fetch(baseUrl.toString(), payload)];
                case 2:
                    body = _a.sent();
                    return [4 /*yield*/, body.json()];
                case 3:
                    response = _a.sent();
                    playlists = playlists.concat(response.items);
                    total = response.total;
                    offset += limit;
                    _a.label = 4;
                case 4:
                    if (playlists.length < total) return [3 /*break*/, 1];
                    _a.label = 5;
                case 5: return [2 /*return*/, playlists];
            }
        });
    });
}
function loadPlaylists() {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, loadButton, tbody, playlists, table, tbody, i, playlist, row, exportCell, checkbox, name_1, owner, tracks, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accessToken = localStorage.getItem("accessToken");
                    if (accessToken === null) {
                        throw new Error("No access token found in local storage.");
                    }
                    loadButton = document.getElementById("load-playlists");
                    if (loadButton !== null) {
                        loadButton.setAttribute("disabled", "true");
                        loadButton.innerText = "Loading...";
                        tbody = safeGetById("playlists-tbody");
                        while (tbody.firstChild) {
                            tbody.removeChild(tbody.firstChild);
                        }
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetchPlaylists(accessToken)];
                case 2:
                    playlists = _a.sent();
                    console.log(playlists);
                    sessionStorage.setItem("playlists", JSON.stringify(playlists));
                    table = safeGetById("playlists-table");
                    tbody = safeGetById("playlists-tbody");
                    if (tbody === undefined) {
                        throw new Error("No tbody found in table with id 'playlists-table'");
                    }
                    for (i = 0; i < playlists.length; i++) {
                        playlist = playlists[i];
                        row = document.createElement("tr");
                        exportCell = document.createElement("td");
                        checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.id = i.toString();
                        exportCell.appendChild(checkbox);
                        row.appendChild(exportCell);
                        name_1 = document.createElement("td");
                        name_1.innerText = playlist.name;
                        row.appendChild(name_1);
                        owner = document.createElement("td");
                        owner.innerText = playlist.owner.display_name;
                        row.appendChild(owner);
                        tracks = document.createElement("td");
                        tracks.innerText = playlist.tracks.total.toString();
                        row.appendChild(tracks);
                        tbody.appendChild(row);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error loading playlists: ", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    if (loadButton !== null) {
                        loadButton.innerText = "Reload Playlists";
                        // Re-enable button after 1 second to prevent spam
                        setTimeout(function () {
                            loadButton.removeAttribute("disabled");
                        }, 1500);
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function selectAllPlaylists(el) {
    var e_1, _a;
    if (el === void 0) { el = null; }
    var table = safeGetById("playlists-table");
    var checked = el !== null ? el.checked : false;
    var checkboxes = table.querySelectorAll("input[type='checkbox']");
    try {
        // Set all checkboxes to same value as the 'select all' checkbox
        for (var _b = __values(Array.from(checkboxes)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var checkbox = _c.value;
            checkbox.checked = checked;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function selectMyPlaylists(el) {
    var e_2, _a;
    if (el === void 0) { el = null; }
    var table = safeGetById("playlists-table");
    var checked = el !== null ? el.checked : false;
    var playlists = JSON.parse(sessionStorage.getItem("playlists") || "[]");
    if (playlists.length === 0) {
        throw new Error("No playlists found in session storage.");
    }
    var userId = sessionStorage.getItem("userId");
    if (userId === null) {
        throw new Error("No user id found in session storage.");
    }
    var checkboxes = table.querySelectorAll("input[type='checkbox']");
    try {
        for (var _b = __values(Array.from(checkboxes)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var checkbox = _c.value;
            var ownerId = playlists[parseInt(checkbox.id)].owner.id;
            if (ownerId === userId) {
                checkbox.checked = checked;
            }
            // Uncheck other playlists if selecting only mine
            else if (checked) {
                checkbox.checked = false;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function exportPlaylists() {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, playlists, table, checkboxes, selectedPlaylists, _a, _b, checkbox, fields, playlistDetails, selectedPlaylists_1, selectedPlaylists_1_1, playlist, baseUrl, params, payload, body, response, e_3_1, data, blob, url, a;
        var e_4, _c, e_3, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    accessToken = localStorage.getItem("accessToken");
                    if (accessToken === null) {
                        throw new Error("No access token found in local storage.");
                    }
                    playlists = JSON.parse(sessionStorage.getItem("playlists") || "[]");
                    if (playlists.length === 0) {
                        throw new Error("No playlists found in session storage.");
                    }
                    table = safeGetById("playlists-table");
                    checkboxes = table.querySelectorAll("input[type='checkbox']");
                    selectedPlaylists = [];
                    try {
                        for (_a = __values(Array.from(checkboxes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            checkbox = _b.value;
                            if (checkbox.checked) {
                                selectedPlaylists.push(playlists[parseInt(checkbox.id)]);
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    fields = "name,owner.display_name,description,collaborative,tracks.items(track(name,artists(name),album(name,album_type)),added_by.id,added_at)";
                    playlistDetails = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 7, 8, 9]);
                    selectedPlaylists_1 = __values(selectedPlaylists), selectedPlaylists_1_1 = selectedPlaylists_1.next();
                    _e.label = 2;
                case 2:
                    if (!!selectedPlaylists_1_1.done) return [3 /*break*/, 6];
                    playlist = selectedPlaylists_1_1.value;
                    baseUrl = new URL("https://api.spotify.com/v1/playlists/".concat(playlist.id));
                    params = new URLSearchParams({
                        fields: fields,
                    });
                    baseUrl.search = params.toString();
                    payload = {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer ".concat(accessToken),
                        }
                    };
                    return [4 /*yield*/, fetch(baseUrl.toString(), payload)];
                case 3:
                    body = _e.sent();
                    return [4 /*yield*/, body.json()];
                case 4:
                    response = _e.sent();
                    playlistDetails.push(response);
                    _e.label = 5;
                case 5:
                    selectedPlaylists_1_1 = selectedPlaylists_1.next();
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_3_1 = _e.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (selectedPlaylists_1_1 && !selectedPlaylists_1_1.done && (_d = selectedPlaylists_1.return)) _d.call(selectedPlaylists_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 9:
                    console.log(playlistDetails);
                    data = JSON.stringify(playlistDetails, null, 2);
                    blob = new Blob([data], { type: "application/json" });
                    url = URL.createObjectURL(blob);
                    a = document.createElement("a");
                    a.href = url;
                    a.download = "spotify-playlists.json";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    return [2 /*return*/];
            }
        });
    });
}
