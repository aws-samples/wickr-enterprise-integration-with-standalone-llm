#!/bin/bash

## Setting Up Cloud9 Environment ##
echo "Setting up Cloud9 Environment"

cd ~
sudo yum -y update
sudo yum install -y make glibc-devel gcc gcc-c++ gcc10.x86_64 gcc10-c++.x86_64 python3 git cmake3
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

. ~/.bashrc 
nvm install 16 
sudo chmod u=rwx,g=rx,o=rx ~ 
#Download and Run the AWS Cloud9 Installer
wget -O - https://d3kgj69l4ph6w4.cloudfront.net/static/c9-install-2.0.0.sh | bash 


## Setting up Miniconda Environment ##
echo "Setting up Miniconda Environment"
echo 
mkdir -p ~/miniconda3 
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh 
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3 
rm -rf ~/miniconda3/miniconda.sh 
~/miniconda3/bin/conda init bash 
~/miniconda3/bin/conda init zsh 
#activate conda and update it
bash 
conda update -n base -c defaults conda 
conda deactivate 

## Setting up Falcon GGLLM ##
echo "Setting up Falcon GGLLM"
echo
mkdir ~/ggllm 
cd ~/ggllm 
git clone https://github.com/cmp-nct/ggllm.cpp 
cd ggllm.cpp/ 
rm -rf build; mkdir build; cd build 

export CC=/usr/bin/gcc10-gcc 
export CXX=/usr/bin/gcc10-g++ 

cmake3  -DLLAMA_CUBLAS=0 .. 
cmake3 --build . --config Release 

cd ~/ggllm
mkdir falcon-7b-instruct-GGML
cd falcon-7b-instruct-GGML/
echo
echo "Now exit and re-connect"
