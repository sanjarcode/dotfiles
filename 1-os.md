## Installation steps

1. <details> <summary> Windows + Ubuntu dual boot </summary> Install Windows first (on the "left" side of the disk, keep any OS agnostic disk parititons in the middle and leave space for Ubuntu on "right side), then install Ubuntu</details>
2. Windows - Create live USB using ISO with Rufus and install
3. MacOS - comes installed
4. <details> <summary> Linux - Ubuntu </summary> Create live USB using ISO with Rufus (Windows) or Startup Disk Creator (Ubuntu), set up `/` and `/home` and swap spaces and install</details>

## Partition sizes

### 512 GB - dual boot OK

| # | name         | type |  total |  free | comment                                 |
|---|--------------|------|-------:|------:|-----------------------------------------|
| 1 | Windows side | NTFS | 240 GB | 40 GB | Can hold many games                     |
| 2 | MyMedia      | NTFS | 85 GB  |       | Books, movies, downloaded games         |
| 3 | Linux /      | Ext4 | 40 GB  |       | Mostly OS stuff, some app installations |
| 4 | Linux /home  | Ext4 | 140 GB | 50 GB | home_files dir, Android SDK, work files |
| 5 | Linux /swap  | swap | 10 GB  |       |                                         |

### 256 GB - mac

| # | name        | type |  size | comment                         |
|---|-------------|------|------:|---------------------------------|
| 1 | macOS       |      | 15 GB | OS                              |
| 2 | System Data |      | 60 GB | OS data                         |
| 3 | Apps        |      | 50 GB | my apps, office installed apps  |
| 4 | Work files  |      | 40 GB | work files, personal work files |
| - | Free space  |      | 70 GB | free space                      |

## Issues and fixes (encountered so far)

1. Disable proprietary tech like Intel RST (causes detection issue of bootloader). [Mirror](https://askubuntu.com/a/1327643/976489)
2. Intel VMD (causes detection issue of the disk partition). [Source](https://www.asus.com/support/FAQ/1044458/)
3. Turn off secure boot from BIOS settings - Secure Boot ON while trying to dual boot Ubuntu and Windows 11 causes a problem.  \*uck the anti-cheat requirements like Valorant
