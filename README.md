## Usage

### Install
```sh
cd ~ && git clone git@gist.github.com:92aa6a164d16e51c343eed926047fb1f.git ~/.dotfiles && cd - # clone
source ~/.dofiles/install.sh # install
```

### Uninstall
```sh
source dot_remove # uninstall
```

also run for cleanup:
```sh
rm -rf ~/.dotfiles
```

## What each file does

1. zshrc - just a caller
2. terminal_tool - Oh-my-zsh
3. path_declarations - complilers/interpreters
4. function_declarations - custom functions
