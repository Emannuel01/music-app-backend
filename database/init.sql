-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de áudios
CREATE TABLE IF NOT EXISTS audios (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    music_name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    group_artists TEXT,
    year INT,
    description TEXT,
    lyrics TEXT,
    album_art_filename VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de playlists
CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de junção entre playlists e áudios
CREATE TABLE IF NOT EXISTS playlist_audios (
    id SERIAL PRIMARY KEY,
    playlist_id INT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    audio_id INT NOT NULL REFERENCES audios(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, audio_id) -- Impede que a mesma música seja adicionada duas vezes na mesma playlist
);

-- Cria a tabela de favoritos
CREATE TABLE IF NOT EXISTS favorite_audios (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    audio_id INT NOT NULL REFERENCES audios(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, audio_id)
);

-- Cria a tabela de histórico de reprodução
CREATE TABLE IF NOT EXISTS play_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    audio_id INT NOT NULL REFERENCES audios(id) ON DELETE CASCADE,
    played_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
