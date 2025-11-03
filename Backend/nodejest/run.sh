if [ -d "/home/coder/project/workspace/nodeapp/tests/" ]
    then
        rm -r /home/coder/project/workspace/nodeapp/tests;
fi
cp -r /home/coder/project/workspace/nodejest/tests /home/coder/project/workspace/nodeapp/;
cd /home/coder/project/workspace/nodeapp;
source /usr/local/nvm/nvm.sh
nvm use 14
export CI=true;
fuser -k -n tcp 8080
if [ -d "/home/coder/project/workspace/nodeapp/node_modules" ]; then
    cd /home/coder/project/workspace/nodeapp/
    npm test --verbose --testPathPattern=tests 2>&1;
else
    cd /home/coder/project/workspace/nodeapp/
    yes | npm install
    npm test --verbose --testPathPattern=tests 2>&1;
fi