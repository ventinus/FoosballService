# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


# Endpoints
* `/InitializeTeamConfiguration`
  * Creates a record with the data `{ completed: [], current: null }` properties for team configuration if needed

* `/GetGames`
  * Gets the record for team configuration and returns games matching params (if provided)

* `/GetCurrentGame`
  * Gets the current game for team configuration

* `/DeleteCurrentGame`
  * Sets the current game to `null` for team configuration

* `/UpdateCurrentGame`
  * Updates current game data

* `/FinalizeGame`
  * Updates the current game data and pushes it into the `completed` array. Sets `current` to `null`
