import pathlib

def load_netscape_cookies(path: str = "www.google.com_cookies.txt"):
    """Parse Netscape cookie file -> list of playwright cookie dicts"""
    p = pathlib.Path(path)
    if not p.exists():
        # try alternative location
        p = pathlib.Path("E:/scraping_gmaps/www.google.com_cookies.txt")
        if not p.exists():
            print(f"[AUTH] Cookie file not found: {path}")
            return []
    cookies = []
    for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
        line=line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 7:
            # fallback split by whitespace
            parts = line.split()
            if len(parts) < 7:
                continue
        domain, flag, cpath, secure, expires, name, value = parts[:7]
        # playwright expects domain without leading dot? keep as is but remove leading dot for compatibility
        # google.com cookies: .google.com -> will be set for google.com
        secure = secure == "TRUE"
        try:
            expires = int(expires)
        except:
            expires = -1
        cookies.append({
            "name": name,
            "value": value,
            "domain": domain,
            "path": cpath,
            "expires": expires,
            "httpOnly": False,
            "secure": secure,
            "sameSite": "Lax" if secure else "Lax"
        })
    print(f"[AUTH] Loaded {len(cookies)} cookies from {p}")
    for c in cookies[:3]:
        print(f"  - {c['name']}={c['value'][:30]}...")
    return cookies

def load_storage_state_from_cookies(path: str = "www.google.com_cookies.txt"):
    cookies = load_netscape_cookies(path)
    return {"cookies": cookies, "origins": []}
