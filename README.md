# Voodoo Server

# :warning: Discontinuation Notice

After flagging a breaking change to the A Township Tale's API service with the Alta team and hearing nothing for 90 days, I have decided to discontinue the Voodoo Mod. It was never a secret that Alta doesn't prioritise the support for bot development by the community, and so I took on a risk. A risk I thought was worth it for the last **two years** of running Voodoo. But after the breaking changes introduced late February 2023, I have lost faith that bot developers for this game are supported appropriately or will be in the future. I've poured uncountable hours of my free time into this project, so it's with a heavy heart that I decided to abandon it. My appetite for maintaining Voodoo has soured to the point where I just don't experience satisfaction from working on it compared to the frustrations I'm facing when interacting with Alta. Thank you all for enjoying Voodoo when it worked. It was never perfect, but I like to think that it brought you all some additional gameplay while it lasted.

## Architecture

```
┌──────┐               ┌───────────────┐                      ┌──────────┐                       ┌───────────────┐
│ User │               │ Voodoo Client │                      │ Alta API │                       │ Voodoo Server │
└──┬───┘               └───────┬───────┘                      └─────┬────┘                       └───────┬───────┘
   │                           │                                    │                                    │
  ┌┴┐ Clicks login             │                                    │                                    │
  │1├─────────────────────────►│                                    │                                    │
  └┬┘                          │                                    │                                    │
   │                          ┌┴┐                                   │                                    │
   │                        ┌─┤2│                                   │                                    │
   │ Generate Code Verifier │ └┬┘                                   │                                    │
   │     and Code Challenge │  │                                    │                                    │
   │                        └─►│                                    │                                    │
   │                           │  Send Code Challenge and           │                                    │
   │                          ┌┴┐ request Authorisation Code        │                                    │
   │                          │3├──────────────────────────────────►│                                    │
   │                          └┬┘                                   │                                    │
   │                           │             Redirect to auth page ┌┴┐                                   │
   │◄──────────────────────────┼───────────────────────────────────┤4│                                   │
   │                           │                                   └┬┘                                   │
  ┌┴┐ Authenticate and consent │                                    │                                    │
  │5├──────────────────────────┼───────────────────────────────────►│                                    │
  └┬┘                          │                                    │                                    │
   │                           │                Authorisation Code ┌┴┐                                   │
   │                           │◄──────────────────────────────────┤6│                                   │
   │                           │                                   └┬┘                                   │
   │                           │  Send Auth Code and Code Verifier  │                                    │
   │                          ┌┴┐ and request Access Token          │                                    │
   │                          │7├──────────────────────────────────►│                                    │
   │                          └┬┘                                   │                                    │
   │                           │                                   ┌┴┐                                   │
   │                           │                                 ┌─┤8│                                   │
   │                           │          Validate Code Verifier │ └┬┘                                   │
   │                           │              and Code Challenge │  │                                    │
   │                           │                                 └─►│                                    │
   │                           │                                    │                                    │
   │                           │           Access / Refresh Tokens ┌┴┐                                   │
   │                           │◄──────────────────────────────────┤9│                                   │
   │                           │                                   └┬┘                                   │
   │                         ┌─┴┐ Store Access Token                │                                    │
   │                         │10├───────────────────────────────────┼───────────────────────────────────►│
   │                         └─┬┘                                   │                                    │
   │                           │                                    │               Request account ID ┌─┴┐
   │                           │                                    │◄─────────────────────────────────┤11│
   │                           │                                    │                                  └─┬┘
   │                           │                                  ┌─┴┐ Account ID                        │
   │                           │                                  │12├──────────────────────────────────►│
   │                           │                                  └─┬┘                                   │
   │                           │                                    │                                  ┌─┴┐
   │                           │                                    │                                ┌─┤13│
   │                           │                              ┌─────┴────┐         Pair Access Token │ └─┬┘
   │                           │                              │ Alta API │             to account ID │   │
   │                           │                              └──────────┘                           └──►│
   │                           │                                                                         │
   │                           │                                                        User logged in ┌─┴┐
   │                           │◄──────────────────────────────────────────────────────────────────────┤14│
   │                           │                                                                       └─┬┘
   │    Wait for server join ┌─┴┐                            ┌─────────────┐                             │
   │◄────────────────────────┤15│                            │ Game Server │                             │
   │                         └─┬┘                            └──────┬──────┘                             │
 ┌─┴┐ Enters game server       │                                    │                                    │
 │16├──────────────────────────┼───────────────────────────────────►│                                    │
 └─┬┘                          │                                    │                                    │
   │                           │                                  ┌─┴┐          *Player entered* event   │
   │                           │                                  │17├──────────────────────────────────►│
   │                           │                                  └─┬┘                                   │
   │                           │                                    │                                    │
   │                           │                                    │                 Player connected ┌─┴┐
   │                           │◄───────────────────────────────────┼──────────────────────────────────┤18│
   │                           │                                    │                                  └─┬┘
   │   Show Voodoo interface ┌─┴┐                                   │                                    │
   │◄────────────────────────┤19│                                   │                                    │
   │                         └─┬┘                                   │                                    │
 ┌─┴┐ Speaks                   │                                    │                                    │
 │20├─────────────────────────►│                                    │                                    │
 └─┬┘                          │                                    │                                    │
   │                         ┌─┴┐                                   │                                    │
   │                       ┌─┤21│                                   │                                    │
   │        Speech-to-text │ └─┬┘                                   │                                    │
   │            processing │   │                                    │                                    │
   │                       └──►│                                    │                                    │
   │                           │                                    │                                    │
   │                         ┌─┴┐ Submit recognised text            │                                    │
   │                         │22├───────────────────────────────────┼───────────────────────────────────►│
   │                         └─┬┘                                   │                                    │
   │                           │                                    │                                  ┌─┴┐
   │                           │                                    │                                ┌─┤23│
   │                           │                                    │                  Validate text │ └─┬┘
   │                           │                                    │                                │   │
   │                           │                                    │                                └──►│
   │                           │                                    │                                    │
   │                           │                                    │         Matching console command ┌─┴┐
   │                           │                                    │◄───────────────────────────────┬─┤24│
   │                           │                                    │                  and/or modify │ └─┬┘
   │                           │                                    │                   Voodoo stats │   │
   │                           │                                    │                                └──►│
   │                           │                                    │                                    │
┌──┴───┐               ┌───────┴───────┐                     ┌──────┴──────┐                     ┌───────┴───────┐
│ User │               │ Voodoo Client │                     │ Game Server │                     │ Voodoo Server │
└──────┘               └───────────────┘                     └─────────────┘                     └───────────────┘
```
